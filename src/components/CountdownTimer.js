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

export default function CountdownTimer({ initialSeconds }) {
    const [seconds, setSeconds] = useState(initialSeconds);
    useEffect(() => {
        if (seconds > 0) {
            const timer = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);

            return () => clearInterval(timer); // Cleanup on unmount or when seconds change
        }
        // If seconds reach 0, clear the interval and make a pop out effect
    }, [seconds]);

    const [examDateTime, setExamDateTime] = useState(dayjs()); // State to store the exam date and time

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

    const [isTimeLeftVisible, setIsTimeLeftVisible] = useState(false); // State to control visibility

    return (
        <div>
            {isTimeLeftVisible && (
                <p id='time-left-display' style={{ display: isTimeLeftVisible ? 'block' : 'none' }}>
                    {seconds > 0
                        ? `${Math.floor(seconds / 86400)} days, ${dayjs().startOf('day').add(seconds % 86400, 'second').format('HH')} hours, ${dayjs().startOf('day').add(seconds % 86400, 'second').format('mm')} minutes, and ${dayjs().startOf('day').add(seconds % 86400, 'second').format('ss')} seconds left`
                        : 'Time is up!'}
                </p>
            )}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'TimeField']}>
                    <DatePicker
                        label="Select Exam Date"
                        value={examDateTime}
                        onChange={(newDate) => {
                            if (newDate) {
                                setExamDateTime(examDateTime.set('date', newDate.date()).set('month', newDate.month()).set('year', newDate.year()));
                            }
                        }}
                    />
                    <TimeField
                        label="Select Exam Time"
                        value={examDateTime}
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
                    onClick={() => {
                        setSeconds(examDateTime.diff(dayjs(), 'second'));
                        setIsTimeLeftVisible(true); // Show the time-left-display
                    }}
                >
                    Enter Exam Date And Time
                </Button>
            </div>
        </div>
    );
};