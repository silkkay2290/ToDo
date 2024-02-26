/*
I wanted to show I could work within the constraints of the original function signatures
i also commented out the lines of code that shows the basic functionality without the api calls to django rest api, in addition, i tried not to change 
the uncommented too much so I can easily comment anything out and show the basic functionality
*/

import React, { useEffect, useState } from "react";
import axios from "axios";
// initial task list
// import { taskList } from "./tasks";
// material components
import { DataGrid } from "@mui/x-data-grid";
import { Button, Checkbox, Dialog } from "@mui/material";

export const ToDoList = () => {
	// initial values and functions for react state variables
	// task list
	const [tasks, setTasks] = useState([]);
	const [errors, setErrors] = useState("");

	const fetchTask = async () =>{
		try{
			const res = await axios.get("http://127.0.0.1:8000/todos")
			setTasks(res.data)
		} catch(err){
			setErrors(err)
		}
	}
	useEffect(() => {
		fetchTask();
	}, [])


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
		setSelection(tasks.filter(task => ids.includes(task.id)))
	}

	/**
	 * @description function for submitting from the dialog
	 * INSTRUCTIONS: use the mode to determine which function to call when
	 * clicking the submit button
	 */
	const handleSubmit = () => {
		if(mode === 'ADD'){
			createTask();
		}else {
			updateTask();
			fetchTask();
		}
	};

	/**
	 * @description function to create a task for the toDo list
	 * INSTRUCTIONS: use the description state variable to create a new task object
	 * and add it with the setTasks hook
	 */
	const createTask = async () => {
		const newTask = {
			description: description,
			complete: false
		}
		try {
			const res = await axios.post("http://127.0.0.1:8000/todos", newTask)
			const addedTasks = res.data;
			setTasks([...tasks, addedTasks]);
			setDescription('');
			closeDialog();
		}catch(err) {
			setErrors(err);
		}

	};

	/**
	 * @description function to update an exsting task
	 * INSTRUCTIONS: use the selection state variable and setTasks hook
	 * with a js map to create a new task array
	 */
	const updateTask = async() => {
		console.log('inside upodate')
		try{
			const updatedTasks = tasks.map(task => {
				if(selection.includes(task)) {
					for (const task of selection) {
						axios.patch("http://127.0.0.1:8000/todos/" +task.id,  {...task, description: description} );
						console.log(`Task with ID ${task.id} updated successfully.`);
				}
					return {...task, description: description}
				}
				return task
			})
			fetchTask()
			setSelection([])
			// setTasks(updatedTasks)
			setDescription('')
			closeDialog()
		}catch(err){
			setErrors(err)
		}
		

	};

	/**
	 * @description method to remove an existing task
	 * INSTRUCTIONS: use the selection state variable and setTasks hook
	 * with a js filter to create a new task array
	 */
	const removeTask = async() => {
		try {
			// Make a DELETE request for each selected task
			// currently the api doesnt not handle multiple delete of tasks heres what it would look like if the api did handle multiple
			/* By using Promise.all(), we can execute multiple asynchronous operations concurrently, 
			which can improve the efficiency of the process, especially if there are many tasks to delete.
			*/
	   			// await Promise.all(selection.map(async task => {
				// await axios.delete("http://127.0.0.1:8000/todos/" +task.id);
				// console.log(`Task with ID ${task.id} deleted successfully.`);
			for (const task of selection) {
				await axios.delete("http://127.0.0.1:8000/todos/" +task.id);
				console.log(`Task with ID ${task.id} deleted successfully.`);
			}
			fetchTask();
			setSelection([]);
		} catch (error) {
			setErrors(error);
		}

		// const updatedTasks = tasks.filter(task => !selection.includes(task));
		// setTasks(updatedTasks)
	};

	/**
	 * @description method to mark a task as complete
	 * @param {*} id the id of the task to mark as complete
	 * INSTRUCTIONS: use the setTasks hook with a js map to create a new task array
	 */
	const completeTask = (id) => {
		setTasks(tasks.map(task => {
			if (task.id === id) {
				//I would remove this line for basic functionality 
				axios.patch("http://127.0.0.1:8000/todos/" +task.id,  {...task, complete: !task.complete} );
				console.log(`Task with ID ${task.id} updated successfully.`);
				// Return a new task object with the 'status' property updated to 'complete'
				return {...task, complete: !task.complete};
			}
			return task; // Return the task unchanged if it's not the one to mark as complete
		}));
		
		// Update the tasks state variable with the updatedTasks array
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
