# Arbitre Runner

`runner` is the django app that runs tests on a given code file, using Judge0.

When a *Submission* is saved, it is judged by Judge0 using the tests defined by the teacher.

The test results are then stored under a TestResult object, and displayed at /runner/\[submission_id\]/results.