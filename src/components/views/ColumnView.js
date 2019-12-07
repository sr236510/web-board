import React from 'react';
import {Button} from "react-bootstrap";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

require("../../styles/Column.css");
require("../../styles/Task.css");

class ColumnView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            render: false,
            modalShow: false,
            modalAddShow: false,
            modalTask: "",
            taskName: "",
            taskOrder: "",
            estimated: "",
            newName: "",
            newOrder: "",
            newEstimated: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    renderTasks = () => {
        if (this.props.tasks.length === 0) {
            return (<div className="no-content">Brak zadań!</div>)
        }

        return this.props.tasks.map(task =>
            this.renderTask(task)
        );
    };

    renderModal = (task) => {
        this.setState({
            modalShow: true,
            modalTask: task,
            newName: task.name,
            newOrder: task.order,
            newEstimated: task.estimatedTime
        })
    };

    renderTask = (task) => {
        const handleClose = () => {
            this.setState({
                newName: "",
                newOrder: "",
                newEstimated: "",
                modalShow: false
            })
        };

        const handleEdit = () => {
            this.props.handleEdit({
                "name": this.state.modalTask.name,
                "newName": this.state.newName,
                "order": this.state.newOrder,
                "estimatedTime": this.state.newEstimated
            });
            handleClose();
            this.setState({
                modalTask: ""
            });
        };

        return (
            <div className="task">
                <div className="bookmark task-head">
                    {task.name}
                    <Button
                        className="action-button delete"
                        id={task.name}
                        onClick={this.handleDelete}
                        variant="danger"
                    >
                        X
                    </Button>
                    <Button
                        className="action-button edit"
                        id={task.name}
                        onClick={() => this.renderModal(task)}
                        variant="warning"
                    >
                        O
                    </Button>
                    <Dialog open={this.state.modalShow} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Edytuj zadanie {this.state.modalTask.name}</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="newName"
                                label="Nazwa zadania"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.newName}
                                fullWidth
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                name="newOrder"
                                label="Kolejność zadania"
                                type="number"
                                min={1}
                                onChange={this.handleChange}
                                value={this.state.newOrder}
                                fullWidth
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                name="newEstimated"
                                label="Czas zadania"
                                type="number"
                                min={1}
                                onChange={this.handleChange}
                                value={this.state.newEstimated}
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Anuluj
                            </Button>
                            <Button onClick={handleEdit}
                                    disabled={this.state.newName === "" || this.state.newOrder === "" || this.state.newEstimated === ""}
                                    color="primary">
                                Zapisz
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        )
    };

    renderAddModal = () => {
        this.setState({
            modalAddShow: true,
        })
    };

    renderAddTask = () => {
        const handleClose = () => {
            this.setState({
                modalAddShow: false,
                newName: ""
            })
        };

        const handleAdd = () => {
            this.props.handleSubmit({
                "estimatedTime": this.state.estimated,
                "name": this.state.taskName,
                "order": this.state.taskOrder
            });
            this.setState({estimatedTime: "", taskName: "", taskOrder: ""});
            handleClose();
            this.setState({
                modalTask: ""
            });
        };

        return (
            <div>
                <Button
                    className="add-button new-task"
                    onClick={this.renderAddModal}
                    variant="success"
                >
                    +
                </Button>
                <Dialog open={this.state.modalAddShow} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Dodaj zadanie</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="taskName"
                            label="Nazwa zadania"
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.taskName}
                            fullWidth
                        >
                        </TextField>
                        <TextField
                            margin="dense"
                            name="taskOrder"
                            label="Kolejność"
                            type="number"
                            min={1}
                            onChange={this.handleChange}
                            value={this.state.taskOrder}
                            fullWidth
                        >
                        </TextField>
                        <TextField
                            margin="dense"
                            name="estimated"
                            label="Szacowany czas"
                            type="number"
                            min={1}
                            onChange={this.handleChange}
                            value={this.state.estimated}
                            fullWidth
                        >
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Anuluj
                        </Button>
                        <Button onClick={handleAdd}
                                disabled={this.state.taskName === ""
                                || this.state.taskOrder === ""
                                || this.state.estimated === ""}
                                color="primary">
                            Dodaj
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    };

    handleDelete = e => {
        e.preventDefault();
        this.props.handleDelete(e.target.id);
    };

    handleChange = e => {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value});
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.handleSubmit({
            "estimatedTime": this.state.estimated,
            "name": this.state.taskName,
            "order": this.state.taskOrder
        });
        this.setState({estimatedTime: "", taskName: "", taskOrder: ""});
    };

    componentDidMount() {
        setTimeout(function () {
            this.setState({render: true})
        }.bind(this), 1000)
    }

    render() {
        let renderContainer = false;
        if (this.state.render) {
            renderContainer =
                <div>
                    {this.renderTasks()}
                    {this.renderAddTask()}
                </div>
        }
        return (
            renderContainer
        )
    }

}

export default ColumnView;
