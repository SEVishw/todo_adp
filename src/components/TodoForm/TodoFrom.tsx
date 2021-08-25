import React, { useRef, useState } from 'react';
import type { ProColumns, ColumnsState, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import "./TodoFrom.css";

function TodoFrom() {
    const actionRef = useRef<ActionType>();
    interface TableListIteam{
        id: number;
        Date: string;
        Task: string;
        Status: string;
    }

    const [count,setCount] = useState<number>(3);
    const today = new Date();
    const [task,setTask] = useState<string>("");
    const [status,setStatus] = useState<string>("Hold");
    const [modifyBtm,setModifyBtn] = useState<boolean>(true);
    const [editData,setEditData] = useState<TableListIteam[]>();
    
    const [todoData,setTodoData] = useState<TableListIteam[]>([{
        id: 1,
        Date: today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear(),
        Task: "todo",
        Status: "Done",
    },{
        id: 2,
        Date: today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear(),
        Task: "python",
        Status: "Running",
    },]);

    const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
        name: {
          show: false,
          order: 2,
        },
      });

    const columns: ProColumns<TableListIteam>[] = [{
        title: "Sr. No:",
        dataIndex: "id",
        key: "id",
    },{
        title: "Created At",
        dataIndex: "Date",
        key: "Date",
    },{
        title: "Task",
        dataIndex: "Task",
        key: "Task",
    },{
        title: "Status",
        render: (val:any) => {
            return (
                <select name="Status" id="Status" onChange={(e) => handleSoloEdit(e.target.value,val.id)}>
                    <option value="Hold" selected={val.Status === "Hold" ? true : false}>Hold</option>
                    <option value="Running" selected={val.Status === "Running" ? true : false}>Running</option>
                    <option value="Done" selected={val.Status === "Done" ? true : false}>Done</option>
                </select>
            )
        }
    },{
        title: "Operation",
        render: (val:any) => {
            return (
                <div key={val.id}>
                    <button style={{marginRight:".5rem"}} onClick={() => handleEdit(val.id)} className="edit">Edit</button>
                    <button onClick={() => handleDelete(val.id)} className="dan">Delete</button>
                </div>
            )
        }
    }]
    
    const handleSubmit = (txt:string) => {
        if(txt === "Add"){
            setCount(count+1);
            const newTask : TableListIteam = {
                id: count,
                Date: today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear(),
                Task: task,
                Status: status,
            }
            setTodoData((state) => state.concat(newTask));
            // const newTodo = [newTask,...todoData];
            // setTodoData([...todoData,newTask]);
            actionRef.current?.reload();
        }
        else{
            editData?.map((editD) => {
                editD.Task = task;
                editD.Status = status;
            })
            setTask("");
            setModifyBtn(true);
        }
        
    }

    const handleDelete = (key:number) => {
        const newData = todoData.filter((item) => item.id !== key);
        setTodoData(newData);
        actionRef.current?.reload();
    }

    const handleEdit = (key:number) => {
        setModifyBtn(false);
        const newData = todoData.filter((item) => item.id === key);
        newData.map((editD) => {
            setTask(editD.Task);
            setStatus(editD.Status);
        })
        setEditData(newData);
    }

    const handleSoloEdit = (txt:string,id:number) => {
        todoData.filter((item) => item.id === id).map((change) => {
            change.Status = txt;
        })
    }

    return (
        <div className="todofrom_container">
            <div className="todofrom_form" style={{fontWeight:"bolder"}}>
                <div>Task:<input type="text" className="input_field" onChange={(e) => setTask(e.target.value)} value={task}/></div>
                <div>Status:
                    <select name="Status" id="Status" className="input_field" onChange={(e) => setStatus(e.target.value)} value={status}>
                        <option value="Hold">Hold</option>
                        <option value="Running">Running</option>
                        {!modifyBtm && <option value="Done">Done</option>}
                    </select>
                </div>
                <div><button style={{width:"4rem",marginRight:".5rem"}} onClick={() => handleSubmit(modifyBtm ? "Add" : "Modify")} className={`submit ${modifyBtm ? "add" : "modify"}`}>{modifyBtm ? "Add" : "Modify"}</button></div>
            </div>
            <div>
                <ProTable<TableListIteam, { keyWord?:string }>
                     columns={columns}
                     request={(params) => 
                        Promise.resolve({
                            data: todoData.filter((item) => {
                                if(!params?.keyWord){
                                    return true;
                                }
                                if(item.Task.includes(params?.keyWord) || item.Status.includes(params?.keyWord)){
                                    return true;
                                }
                                return false;
                            }),
                            success: true,
                        })
                    }   
                    rowKey="key"
                    columnsStateMap={columnsStateMap}
                    onColumnsStateChange={(map) => setColumnsStateMap(map)}
                    search={false}
                    dateFormatter="string"
                    headerTitle = "ToDo List"
                    actionRef = {actionRef}
                />
            </div>
        </div>
    )
}

export default TodoFrom
