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

/**
 * TaskManagement component allows users to manage study tasks.
 * Users can add tasks, remove tasks, track time spent, set goal times, and mark tasks as completed.
 *
 * @returns {JSX.Element} The TaskManagement component.
 */
/**
 * TaskManagement component manages a list of tasks with features such as adding, deleting,
 * toggling completion, starting/stopping timers, and resetting task times.
 * It also persists tasks in localStorage to maintain state across page reloads.
 *
 * Tasks are stored in localStorage under the key 'tasks'.
 *
 * The component uses React state to manage tasks and synchronizes changes with localStorage.
 *
 * @component
 */
export default function TaskManagement() {
  /**
   * Retrieves tasks from localStorage if available.
   * @type {Array<Object>}
   */
  const savedTasks = localStorage.getItem('tasks');

  /**
   * State to manage the list of tasks.
   * Each task contains:
   * - id: Unique identifier for the task.
   * - text: Name of the task.
   * - time: Time spent on the task in seconds.
   * - isRunning: Boolean indicating if the timer is running.
   * - checked: Boolean indicating if the task is marked as completed.
   * - goalTime: Optional string representing the goal time in HH:mm:ss format.
   */
  const [tasks, setTasks] = React.useState(savedTasks ? JSON.parse(savedTasks) : []); // Initialize from localStorage if available

  /**
   * Toggles the checked status of a task and saves with localStorage.
   *
   * @param {number} id - The ID of the task to toggle.
   * @returns {Function} A function to handle the toggle action.
   */
  const handleToggle = (id) => () => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, checked: !task.checked } : task
    ));
    localStorage.setItem('tasks', JSON.stringify(tasks.map((task) =>
      task.id === id ? { ...task, checked: !task.checked } : task
    ))); // Update localStorage after toggling
  };

  /**
   * Adds a new task to the task list.
   * The new task is initialized with default values.
   * Tjhe task is also saved to localStorage.
   */
  const handleAddTask = () => {
    const newTask = { id: tasks.length, text: `Task ${tasks.length + 1}`, time: 0, isRunning: false, checked: false };
    setTasks([...tasks, newTask]);
    localStorage.setItem('tasks', JSON.stringify([...tasks, newTask])); // Update localStorage after adding
  };

  /**
   * Deletes a task from the task list.
   * The task is removed from the state and localStorage.
   *
   * @param {number} id - The ID of the task to delete.
   * @returns {Function} A function to handle the delete action.
   */
  const handleDeleteTask = (id) => () => {
    setTasks(tasks.filter((task) => task.id !== id));
    localStorage.setItem('tasks', JSON.stringify(tasks.filter((task) => task.id !== id))); // Update localStorage after deletion
  };

  /**
   * Toggles the start/stop state of a task's timer.
   * The task's isRunning state is updated and saved to localStorage.
   *
   * @param {number} id - The ID of the task to start/stop.
   * @returns {Function} A function to handle the start/stop action.
   */
  const handleStartStop = (id) => () => {
    setTasks(tasks.map((task) => {
      if (task.id === id) {
        localStorage.setItem('tasks', JSON.stringify(tasks.map((t) =>
          t.id === id ? { ...t, isRunning: !t.isRunning } : t
        )));
        return { ...task, isRunning: !task.isRunning };
      }
      return task;
    }));
  };

  /**
   * Resets the time spent on a task to 0 and stops the timer.
   * The task's time and isRunning state are updated and saved to localStorage.
   *
   * @param {number} id - The ID of the task to reset.
   * @returns {Function} A function to handle the reset action.
   */
  const handleReset = (id) => () => {
    setTasks(tasks.map((task) => {
      if (task.id === id) {
        localStorage.setItem('tasks', JSON.stringify(tasks.map((t) =>
          t.id === id ? { ...t, time: 0, isRunning: false } : t
        )));
        return { ...task, time: 0, isRunning: false };
      }
      return task;
    }));
  };

  /**
   * Updates the time spent on tasks every second if the timer is running.
   * Cleans up intervals when the component unmounts or tasks change.
   * Could not find a way to use the react-timer-hook library.
   * useEffect is used to manage the intervals for each task which is useful for handling multiple timers, especially.
   */
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

  /**
   * Formats a time value in seconds into a string in HH:mm:ss format.
   *
   * @param {number} seconds - The time value in seconds.
   * @returns {string} The formatted time string.
   */
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div>
        <Button size="large" id="add-study-task" onClick={handleAddTask}>Add Study Task</Button>
        <List sx={{ width: '100%', maxWidth: 1000 }} inset>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <h2 id='total-time'>
                Total Time Spent: {formatTime(tasks.reduce((acc, task) => acc + task.time, 0))} -- Total Goal Time:{" "}
                {formatTime(
                  tasks.reduce((totalSeconds, task) => {
                    if (task.goalTime) {
                      const [hours, minutes, seconds] = task.goalTime.split(":").map(Number);
                      return totalSeconds + (hours * 3600) + (minutes * 60) + seconds;
                    }
                    return totalSeconds;
                  }, 0)
                )}
              </h2>
            </div>
            {tasks.map((task) => {
                const labelId = `checkbox-list-label-${task.id}`;
                return (
                  <ListItem key={task.id} disablePadding>
                  <ListItemButton role="checkbox" aria-labelledby={labelId} dense>
                    <ListItemText
                    id={labelId}
                    primary={
                      <input
                      type="text"
                      defaultValue={task.text}
                      onChange={(e) => {
                        const newTaskName = e.target.value;
                        setTasks(tasks.map((t) =>
                        t.id === task.id ? { ...t, text: newTaskName } : t,
                        ));
                        localStorage.setItem('tasks', JSON.stringify(tasks.map((t) =>
                          t.id === task.id ? { ...t, text: newTaskName } : t
                        )));
                      }}
                      style={{
                        border: '1px',
                        background: 'transparent',
                        width: '100%',
                      }}
                      variant="outlined"
                      />
                    }
                    />
                    <ListItemIcon>
                    <Checkbox
                      edge="end"
                      checked={task.checked || false} // Use the checked property from the task
                      disableRipple
                      aria-labelledby={labelId} // Associate the label with the checkbox
                      onChange={handleToggle(task.id)}
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
                    <TextField
                    label="Goal Time"
                    value={task.goalTime || "00:00:00"}
                    onChange={(e) => {
                      const newGoalTime = e.target.value;
                        setTasks(tasks.map((t) =>
                        t.id === task.id ? { ...t, goalTime: newGoalTime } : t
                        ));
                        localStorage.setItem('tasks', JSON.stringify(tasks.map((t) =>
                        t.id === task.id ? { ...t, goalTime: newGoalTime } : t
                        )));
                    }}
                    variant="outlined"
                    size="small"
                    />
                    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "3vw" }}>
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