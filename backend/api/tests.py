from django.test import TestCase
from api.calculator import WaitTimeCalculator

def test_blocks_false_outlier_report():
    calc = WaitTimeCalculator(max_diff_from_median=25)

    reports = [20, 20, 20, 20, 20, 100] # case where a user inputs a outlier wait time compared to other recent wait times
    assert calc.calculate_wait(reports) == 20


def test_returns_default_when_no_reports():
    calc = WaitTimeCalculator()
    assert calc.calculate_wait([], default_wait=15) == 15
