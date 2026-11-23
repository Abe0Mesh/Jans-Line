export interface CheckIn {
    waitMins: number;
    createdAt: Date;
}

export class WaitTimeCalculator {
    private maxDiffFromMedian: number; // distance of new data from median thats allowed (filter noisy and incorrect reportings)
    private halfLifeMinutes: number; // time for weight to get halved 

    constructor(maxDiffFromMedian: number = 25, halfLifeMinutes: number = 15) {
        this.maxDiffFromMedian = maxDiffFromMedian;
        this.halfLifeMinutes = halfLifeMinutes;
    }

    private getMedian(numbers: number[]): number {
        const sorted = [...numbers].sort((a, b) => a - b); 
        const mid = Math.floor(sorted.length / 2);

        if (sorted.length % 2 !== 0) { // if odd just return median
            return sorted[mid];
        }

        return (sorted[mid - 1] + sorted[mid]) / 2; // if evenn take avg of two middle nums 
    }

    public filterOutliers(reports: CheckIn[]): CheckIn[] {
        // Need at least 3 reports to identify a outlier
        if (reports.length < 3) {
            return reports; 
        }

        const med = this.getMedian(reports.map((r) => r.waitMins));

        return reports.filter(
            (r) => Math.abs(r.waitMins - med) <= this.maxDiffFromMedian // filter out values that arn't in the median distance threshold 
        );

    }

    public calculateWait(
        reports: CheckIn[], 
        defaultWait: number = 10, 
        currentTime: Date = new Date() 
    ): number {

        if (reports.length === 0) {
            return defaultWait;
        }

        const validReports = this.filterOutliers(reports);
        if (validReports.length === 0) {
            return defaultWait;
        }

        let weightedSum = 0;
        let totalWeight = 0;

        for (const report of validReports) {
            const ageMinutes = Math.max(0, (currentTime.getTime() - report.createdAt.getTime()) / (1000 * 60)); // Distance from time reported to current time in minutes (converted from ms * sec)
            const weight = Math.pow(0.5, ageMinutes / this.halfLifeMinutes); // calculating weight using time decay weight formula 0.5^(age / halflife-time)

            weightedSum += report.waitMins * weight;
            totalWeight += weight;
        }

        if (totalWeight === 0) {
            return defaultWait;
        }

        return Math.ceil(weightedSum / totalWeight); // Final time decay calculation 
    
    }
}


