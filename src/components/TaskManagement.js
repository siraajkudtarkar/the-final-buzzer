import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from "@mui/material/TextField";

export default function TaskManagement() {
  const [checked, setChecked] = React.useState([0]);
  const [tasks, setTasks] = React.useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
        newChecked.push(value);
    } else {
        newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAddTask = () => {
    const newTask = { id: tasks.length, text: `Task ${tasks.length + 1}`, time: 0, isRunning: false };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (id) => () => {
    setTasks(tasks.filter((task) => task.id !== id));
    setChecked(checked.filter((value) => value !== id));
  };

  const handleStartStop = (id) => () => {
    setTasks(tasks.map((task) => {
      if (task.id === id) {
        return { ...task, isRunning: !task.isRunning };
      }
      return task;
    }));
  };

  const handleReset = (id) => () => {
    setTasks(tasks.map((task) => {
      if (task.id === id) {
        return { ...task, time: 0, isRunning: false };
      }
      return task;
    }));
  };

  React.useEffect(() => {
    const timers = tasks.map((task) => {
      if (task.isRunning) {
        return setInterval(() => {
          setTasks((prevTasks) =>
            prevTasks.map((t) =>
              t.id === task.id ? { ...t, time: t.time + 1 } : t
            )
          );
        }, 1000);
      }
      return null;
    });


    return () => timers.forEach((timer) => timer && clearInterval(timer));
  }, [tasks]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div>
        <Button size="medium" id="add-study-task" onClick={handleAddTask}>Add Study Task</Button>
        <List sx={{ width: '100%', maxWidth: 360 }}>
            {tasks.map((task) => {
                const labelId = `checkbox-list-label-${task.id}`;
                return (
                    <ListItem key={task.id} disablePadding>
                        <ListItemButton role={undefined} dense>
                            <ListItemText
                                id={labelId}
                                primary={
                                    <input
                                        type="text"
                                        defaultValue={task.text}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            outline: 'none',
                                            width: '100%',
                                        }}
                                    />
                                }
                            />
                            <ListItemIcon>
                                <Checkbox
                                    edge="end"
                                    checked={checked.includes(task.id)}
                                    tabIndex={-1}
                                    disableRipple
                                    slotProps={{ 'aria-labelledby': labelId }}
                                    onClick={handleToggle(task.id)}
                                />
                            </ListItemIcon>
                            <ListItemIcon>
                                <IconButton edge="end" aria-label="delete" onClick={handleDeleteTask(task.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemIcon>
                        </ListItemButton>
                        <div style={{ display: "block", gap: "5vw" }}>
                            <TextField
                                label="Time Spent"
                                value={formatTime(task.time)}
                                slotProps={{
                                    readOnly: true,
                                }}
                                variant="outlined"
                                size="small"
                            />
                            <div style={{ display: "flex", gap: "1vw", marginBottom: "3vw" }}>
                                <Button id="start-pause" onClick={handleStartStop(task.id)}>
                                    {task.isRunning ? "Pause" : "Start"}
                                </Button>
                                <Button id="reset" onClick={handleReset(task.id)}>Reset</Button>
                            </div>
                        </div>
                    </ListItem>
                );
            })}
        </List>
    </div>
  );
}