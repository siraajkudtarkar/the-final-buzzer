import React, { useState, useEffect } from 'react';
// import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { NumberField } from '@base-ui-components/react/number-field';

/**
 * CountdownTimer component displays a countdown timer based on a user-selected date and time.
 * It allows users to set an exam date and time, and shows the remaining time until the exam.
 *
 * @param {Object} props - Component props.
 * @param {number} props.initialSeconds - Initial seconds for the countdown timer.
 * @returns {JSX.Element} The CountdownTimer component.
 */
export default function CountdownTimer({ initialSeconds }) {
    const [seconds, setSeconds] = useState(initialSeconds);

    /**
     * Updates the countdown timer every second if there are seconds remaining.
     * Clears the interval when the component unmounts or when seconds reach 0.
     * useEffect is used to manage the intervals for each task which is useful for handling multiple timers, especially.
     */
    useEffect(() => {
        if (seconds > 0) {
            const timer = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);

            return () => clearInterval(timer); // Cleanup on unmount or when seconds change
        }
        // If seconds reach 0, clear the interval and make a pop out effect
    }, [seconds]);

    const savedExamDateTime = localStorage.getItem('examDateTime');
    const [examDateTime, setExamDateTime] = useState(savedExamDateTime ? dayjs(savedExamDateTime) : dayjs()); // Initialize from localStorage if available
    const [isTimeLeftVisible, setIsTimeLeftVisible] = useState(!!savedExamDateTime); // Set to true if data exists in localStorage

    /**
     * Updates the remaining time based on the difference between the current time and the exam date/time.
     * Runs every second to keep the countdown accurate.
     * useEffect is used to manage the intervals for each task which is useful for handling multiple timers, especially.
     */
    useEffect(() => {
        const updateTimer = () => {
            const now = dayjs();
            const diffInSeconds = examDateTime.diff(now, 'second');
            setSeconds(diffInSeconds > 0 ? diffInSeconds : 0);
        };
        if (examDateTime.isSame(dayjs().startOf('day').hour(12), 'second')) {
            return; // Do not activate the timer until the exam time is entered
        }
        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    }, [examDateTime]);

    return (
        <div>
            {isTimeLeftVisible && (
                <h1 id='time-left-display' style={{ display: isTimeLeftVisible ? 'block' : 'none' }}>
                    {seconds > 0
                        ? `${Math.floor(seconds / 86400)}d, ${dayjs().startOf('day').add(seconds % 86400, 'second').format('HH')}h, ${dayjs().startOf('day').add(seconds % 86400, 'second').format('mm')}m, ${dayjs().startOf('day').add(seconds % 86400, 'second').format('ss')}s left`
                        : 'Time is up!'}
                </h1>
            )}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'TimeField']}>
                    <DatePicker
                        label="Select Exam Date"
                        value={examDateTime}
                        /**
                         * Handles changes to the exam date.
                         * Updates the `examDateTime` state with the selected date.
                         *
                         * @param {dayjs.Dayjs|null} newDate - The new date selected by the user.
                         */
                        onChange={(newDate) => {
                            if (newDate) {
                                setExamDateTime(examDateTime.set('date', newDate.date()).set('month', newDate.month()).set('year', newDate.year()));
                            }
                        }}
                    />
                    <TimeField
                        label="Select Exam Time"
                        value={examDateTime}
                        /**
                         * Handles changes to the exam time.
                         * Updates the `examDateTime` state with the selected time.
                         *
                         * @param {dayjs.Dayjs|null} newTime - The new time selected by the user.
                         */
                        onChange={(newTime) => {
                            if (newTime) {
                                setExamDateTime(examDateTime.set('hour', newTime.hour()).set('minute', newTime.minute()).set('second', newTime.second()));
                            }
                        }}
                        format="hh:mm:ss A" // Use 12-hour format with AM/PM
                    />
                </DemoContainer>
            </LocalizationProvider>
            <div style={{ marginTop: '2vw' }}>
                <Button
                    id="enter-exam-time"
                    size='large'
                    variant="contained"
                    /**
                     * Handles the "Enter Exam Date And Time" button click.
                     * Sets the countdown timer and makes the time display visible.
                     * Saves the selected exam date and time to localStorage.
                     */
                    onClick={() => {
                        setSeconds(examDateTime.diff(dayjs(), 'second'));
                        setIsTimeLeftVisible(true); // Show the time-left-display
                        localStorage.setItem('examDateTime', examDateTime.toISOString()); // Save to localStorage
                    }}
                >
                    Enter Exam Date And Time
                </Button>
            </div>
        </div>
    );
};