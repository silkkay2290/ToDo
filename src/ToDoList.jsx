import React, { useState } from "react";
// initial task list
import { taskList } from "./tasks";
// material components
import { DataGrid } from "@mui/x-data-grid";
import { Button, Checkbox, Dialog } from "@mui/material";

export const ToDoList = () => {
	// initial values and functions for react state variables
	// task list
	const [tasks, setTasks] = useState(taskList);
	// text of the input field in the dialog
	const [description, setDescription] = useState("");
	// selected item/s
	const [selection, setSelection] = useState([]);
	// dialog visibility
	const [visible, setVisible] = useState(false);
	// whether we're adding or editing from the dialog
	const [mode, setMode] = useState("ADD");

	/**
	 * @description open the dialog
	 */
	const openDialog = () => {
		setVisible(true);
	};

	/**
	 * @description close the dialog
	 */
	const closeDialog = () => {
		setVisible(false);
	};

	/**
	 * @description handler function for adding tasks
	 */
	const handleAdd = () => {
		// set the description
		setDescription("");
		// set the mode
		setMode("ADD");
		// open the dialog
		openDialog();
	};

	/**
	 * @description handler function for editing tasks
	 */
	const handleEdit = () => {
		// set the description from the current selection
		const task = selection[0];
		setDescription(task.description);
		// set the mode
		setMode("EDIT");
		// open the dialog
		openDialog();
	};

	/**
	 * @description function that sets the description state variable
	 * @param {event} event - change event from input
	 */
	const handleDescription = (event) => {
		setDescription(event.target.value);
	};

	/**
	 * @description handler function to set the selection state variable
	 * @param {array} ids - array of IDs passed in from Grid select event
	 * INSTRUCTIONS: use the js filter method to set the selection as an array of tasks
	 */
	const handleSelection = (ids) => {
		// your code here
	};

	/**
	 * @description function for submitting from the dialog
	 * INSTRUCTIONS: use the mode to determine which function to call when
	 * clicking the submit button
	 */
	const handleSubmit = () => {
		// your code here
	};

	/**
	 * @description function to create a task for the toDo list
	 * INSTRUCTIONS: use the description state variable to create a new task object
	 * and add it with the setTasks hook
	 */
	const createTask = () => {
		// your code here
	};

	/**
	 * @description function to update an exsting task
	 * INSTRUCTIONS: use the selection state variable and setTasks hook
	 * with a js map to create a new task array
	 */
	const updateTask = () => {
		// your code here
	};

	/**
	 * @description method to remove an existing task
	 * INSTRUCTIONS: use the selection state variable and setTasks hook
	 * with a js filter to create a new task array
	 */
	const removeTask = () => {
		// your code here
	};

	/**
	 * @description method to mark a task as complete
	 * @param {*} id the id of the task to mark as complete
	 * INSTRUCTIONS: use the setTasks hook with a js map to create a new task array
	 */
	const completeTask = (id) => {
		// your code here
	};

	// the Data grid columns - the renderCell will replace a cell's text with a React component - in this case a checkbox
	const columns = [
		{ field: "description", headerName: "Description", flex: 1 },
		{
			field: "complete",
			headerName: "Complete",
			flex: 0.3,
			renderCell: (params) => (
				<Checkbox checked={params.value} onChange={() => completeTask(params.id)} />
			),
		},
	];

	return (
		<div>
			<h1>To Do List</h1>
			{/* Dialog for adding and editing */}
			<Dialog open={visible}>
				<div style={{ width: "300px" }} className="d-flex flex-column">
					{mode} Task - Enter task description
					<br />
					<input value={description} onChange={handleDescription}></input>
				</div>
				<div className="d-flex justify-content-center">
					{/* handleSubmit needs to contextually call the correct function based on whether you're adding or editing */}
					<Button onClick={handleSubmit}>Submit</Button>
					<Button onClick={closeDialog}>Cancel</Button>
				</div>
			</Dialog>
			{/* Main to do list */}
			<div className="d-flex flex-column align-items-center">
				<div style={{ width: "500px" }}>
					<DataGrid
						onRowSelectionModelChange={handleSelection}
						rows={tasks}
						columns={columns}
					/>
				</div>
				<div className="d-flex justify-content-center">
					<Button onClick={handleAdd}>Add</Button>
					{/* note how the button is disabled if nothing is selected - as soon as an item is selected the button re-renders */}
					<Button onClick={handleEdit} disabled={!selection[0]}>
						Edit
					</Button>
					<Button onClick={removeTask}>Remove</Button>
				</div>
			</div>
		</div>
	);
};
