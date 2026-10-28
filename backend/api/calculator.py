import statistics

class WaitTimeCalculator:
    def __init__(self, max_diff_from_median: int = 25):
        self.max_diff_from_median = max_diff_from_median

    def filter_outliers(self, reports: list[int]) -> list[int]:

        if len(reports) < 3:
            return reports

        med = statistics.median(reports)

        valid = []
        for r in reports:
            if abs(r - med) <= self.max_diff_from_median:
                valid.append(r)
        return valid
    
    def calculate_wait(self, reports: list[int], default_wait: int = 10) -> int:
        if not reports:
            return default_wait

        valid_reports = self.filter_outliers(reports) 
        return round(sum(valid_reports) / len(valid_reports))
