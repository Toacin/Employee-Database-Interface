const inquirer = require("inquirer");
const db = require("./db/connection.js");

// connection initialized here
db.connect((error) => {
    if (error) throw error;
    console.log("Successfully connected to database");
    askInit();
})

// questions initalized below
let initialQuestion = [
    {
        type: "list",
        name: "whatToDo",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View Employees by Department",
            "View Employee by Manager",
            "Add Employee",
            "Remove Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "View All Roles",
            "Add Role",
            "Delete Role",
            "View All Departments",
            "Add Department",
            "View Budget",
            "Delete Department",
            "Quit"
        ]
    }
]

let whatDepartment = [
    {
        name: "departmentName",
        message: "What is the name of the department you would like to add?"
    }
]

// questions with choices are empty below and will be populated later
let whatRole = [
    {
        name: "roleName",
        message: "What is the name of the role you would like to add?"
    },
    {
        name: "salary",
        type: "number",
        message: "What is the salary of this role?"
    },
    {
        type: "list",
        name: "whichDepart",
        message: "Which department does this role belong to?",
        choices: []
    }
]

let whatEmployee = [
    {
        name: "firstName",
        message: "What is the first name of the employee you would like to add?"
    },
    {
        name: "lastName",
        message: "What is the last name of the employee you would like to add?"
    },
    {
        name: "role",
        type: "list",
        message: "What is the role of the current employee?",
        choices: []
    },
    {
        type: "list",
        name: "whichManager",
        message: "Who is the manager of the current employee?",
        choices: []
    }
]

let updateEmployeeQuestion = [
    {
        type: "list",
        name: "employeeName",
        message: "What is the name of the employee who's role you'd like to update?",
        choices: []
    },
    {
        type: "list",
        name: "newManager",
        message: "What is the new role of this employee?",
        choices: []
    }
]

let updateEmpManQuestion = [
    {
        type: "list",
        name: "employeeName",
        message: "What is the name of the employee who's manager you'd like to update?",
        choices: []
    },
    {
        type: "list",
        name: "newManager",
        message: "Who is their new manager?",
        choices: []
    }
]

let viewByDepartmentQuestions = [
    {
        type: "list",
        name: "whichDepartment",
        message: "Which Department would you like to check?",
        choices: []
    }
]

let viewByManagerQuestions = [
    {
        type: "list",
        name: "whichManager",
        message: "Which Manager would you like to check?",
        choices: []
    }
]

// view budget feature not fully completed, although works. In time, this will be utilized but commented out for now
// let viewBudgetQuestion = [
//     {
//         name: "whichDepart",
//         type: "list",
//         message: "Which department's budget would you like to view?",
//         choices: []
//     }
// ]

let deleteDepartmentQuestion = [
    {
        name: "whichDepart",
        type: "list",
        message: "Which department would you like to delete?",
        choices: []
    }
]

let deleteRoleQuestion = [
    {
        name: "whichRole",
        type: "list",
        message: "Which role would you like to delete?",
        choices: []
    }
]

let removeEmployeeQuestion = [
    {
        name: "whichEmployee",
        type: "list",
        message: "Which employee would you like to remove?",
        choices: []
    }
]

// initial question for use to choose database action
function askInit () {
    inquirer.prompt(initialQuestion).then((answers) => {
        // switch user input with all possible values and execute respective function
        switch (answers.whatToDo) {
            case "View All Employees":
                getEmployees();
                break;
            case "View All Roles":
                getRoles();
                break;
            case "View All Departments":
                getDepartments();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Delete Role":
                deleteRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Update Employee Manager":
                updateEmployeeManager();
                break;
            case "View Employees by Department":
                viewByDepartment();
                break;
            case "View Employee by Manager":
                viewByManager();
                break;
            case "View Budget":
                viewBudget();
                break;
            case "Delete Department":
                deleteDepartment();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Quit":
                console.log("Good Bye!");
                process.exit();
                break;
            default:
                break;
        }
    })
};

// simply SQL query to get all data from employee table
let getEmployees = () => {
    db.query("SELECT * FROM employee;", (err, data) => {
        console.table(data);
        askInit();
    })
};

// simply SQL query to get all data from role table
let getRoles = () => {
    db.query("SELECT * FROM role;", (err, data) => {
        console.table(data);
        askInit();
    })
};

// simply SQL query to get all data from department table
let getDepartments = () => {
    db.query("SELECT * FROM department;", (err, data) => {
        console.table(data);
        askInit();
    })
};

// simply SQL query to get all data from employee table
let addDepartment = () => {
    inquirer.prompt(whatDepartment)
    .then((response) => {
        db.query(`INSERT INTO department (name) VALUES (?);`, [response.departmentName], (err, data) => {
            console.log("\n-----------------------------------------\n")
            console.log("New department has been successfully added!")
            console.log("\n-----------------------------------------\n")
            askInit();
        })
    })
};

// to addrole, first update possible department choices, then inquirer.prompt updated question array with appropriate choices. DB query to add role
let addRole = () => {
    db.query("SELECT * FROM department;", (err, data) => {
        whatRole[2].choices = data.map((element) => ({value: element.id, name: element.name}));
        inquirer.prompt(whatRole)
        .then((response) => {
            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?);`, 
            [response.roleName, response.salary, response.whichDepart], 
            (err, data) => {
                console.log("\n-----------------------------------------\n")
                console.log("New role has been successfully added!")
                console.log("\n-----------------------------------------\n")
                askInit();
            })
        })
    })
};

// to add employee, first update possible role choices, second update possible employee for manager choices, then inquirer.prompt updated question array with appropriate choices. DB query to add employee
let addEmployee = () => {
    db.query("SELECT * FROM role;", (err, data) => {
        whatEmployee[2].choices = data.map((element) => ({value: element.id, name: element.title}))
        db.query("SELECT * FROM employee;", (err, data) => {
            whatEmployee[3].choices = data.map((element) => ({value: element.id, name: element.first_name+" "+element.last_name}));
            // push none to choices incase none of the employees in database are their manager
            whatEmployee[3].choices.push({value: null, name: "None"});
            inquirer.prompt(whatEmployee)
            .then((response) => {
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`, 
                [response.firstName, response.lastName, response.role, response.whichManager], 
                (err, data) => {
                    if (err) throw err;
                    console.log("\n-----------------------------------------\n")
                    console.log("New employee has been successfully added!")
                    console.log("\n-----------------------------------------\n")
                    askInit();
                })
            })
        })
    })
};

// function to update employee role
let updateEmployeeRole = () => {
    db.query("SELECT * FROM employee;", (err, data) => {
        // select employee to update
        updateEmployeeQuestion[0].choices = data.map((element) => ({value: element.id, name: element.first_name+" "+element.last_name}));
        db.query("SELECT * FROM role;", (err, data) => {
            // choices for new role
            updateEmployeeQuestion[1].choices = data.map((element) => ({value: element.id, name: element.title}))
            inquirer.prompt(updateEmployeeQuestion)
            .then((response) => {
                // then update role
                db.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, 
                [response.newRole, response.employeeName], 
                (err, data) => {
                    if (err) throw err;
                    console.log("\n-----------------------------------------\n")
                    console.log("Employee's role has been successfully updated!")
                    console.log("\n-----------------------------------------\n")
                    askInit();
                })
            })
        })
    })
};

// function to update employee manager
let updateEmployeeManager = () => {
    db.query("SELECT * FROM employee;", (err, data) => {
        // choices for employee to update
        updateEmpManQuestion[0].choices = data.map((element) => ({value: element.id, name: element.first_name+" "+element.last_name}));
        db.query("SELECT * FROM employee;", (err, data) => {
            // choices for which employee is new manager. push none option in case no manager
            updateEmpManQuestion[1].choices = data.map((element) => ({value: element.id, name: element.first_name+" "+element.last_name}));
            updateEmpManQuestion[1].choices.push({value: null, name: "None"});
            inquirer.prompt(updateEmpManQuestion)
            .then((response) => {
                if (response.employeeName === response.newManager) {
                    // don't update manager in case manager is self, reprompt questions
                    console.log("\n-----------------------------------------\n")
                    console.log("Employee's new manager cannot be themself")
                    console.log("\n-----------------------------------------\n")
                    updateEmployeeManager();
                } else {
                    // else update manager
                    db.query(`UPDATE employee SET manager_id = ? WHERE id = ?;`, 
                    [response.newManager, response.employeeName], 
                    (err, data) => {
                        if (err) throw err;
                        console.log("\n-----------------------------------------------\n")
                        console.log("Employee's manager has been successfully updated!")
                        console.log("\n-----------------------------------------------\n")
                        askInit();
                    })
                }
            })
        })
    })
};

// function to view employees by department
let viewByDepartment = () => {
    db.query("SELECT * FROM department;", (err, data) => {
        viewByDepartmentQuestions[0].choices = data.map((element) => ({value: element.id, name: element.name}));
        inquirer.prompt(viewByDepartmentQuestions)
        .then((response) => {
            db.query("SELECT first_name, last_name, name AS department FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id WHERE department.id = ?;", [response.whichDepartment], (err, data) => {
                console.table(data);
                askInit();
            })
        })
    })
};

// function to view employees by manager
let viewByManager = () => {
    db.query("SELECT * FROM employee;", (err, data) => {
        viewByManagerQuestions[0].choices = data.map((element) => ({value: element.id, name: element.first_name+" "+element.last_name}))
        inquirer.prompt(viewByManagerQuestions)
        .then((response) => {
            db.query("SELECT B.first_name, B.last_name FROM employee A JOIN employee B ON A.id = B.manager_id WHERE A.id = ?;", [response.whichManager], (err, data) => {
                if (data.length === 0) {
                    console.log("\n-----------------------------------------\n")
                    console.log("This person has no subordinates/not a manager")
                    console.log("\n-----------------------------------------\n")
                    askInit();
                } else {
                    console.table(data);
                    askInit();
                }
            })
        })
    })
};

// function to view budget per department
let viewBudget = () => {
    db.query("SELECT sum(salary) AS budget, name AS department FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id GROUP BY name;", (err, data) => {
        console.table(data);
        askInit();
    })
    // this function will eventually allow user to choose which department's budget to view, but for now shows budgets for all departments at once
    // db.query("SELECT * FROM department;", (err, data) => {
    //     viewBudgetQuestion[0].choices = data.map((element) => (element.name));
    //     inquirer.prompt(viewBudgetQuestion)
    //     .then((response) => {
    //     })
    // })
};

// function to delete department
let deleteDepartment = () => {
    db.query("SELECT * FROM department;", (err, data) => {
        deleteDepartmentQuestion[0].choices = data.map((element) => ({value: element.id, name: element.name}));
        inquirer.prompt(deleteDepartmentQuestion)
        .then((response) => {
            db.query("DELETE FROM department WHERE id = ?;", [response.whichDepart], (err, data) => {
                console.log("\n-------------------\n")
                console.log("Department Deleted!")
                console.log("\n-------------------\n")
                askInit();
            })
        })
    })
};

// function to delete role
let deleteRole = () => {
    db.query("SELECT * FROM role;", (err, data) => {
        deleteRoleQuestion[0].choices = data.map((element) => ({value: element.id, name: element.title}));
        inquirer.prompt(deleteRoleQuestion)
        .then((response) => {
            db.query("DELETE FROM role WHERE id = ?;", [response.whichRole], (err, data) => {
                console.log("\n------------\n")
                console.log("Role Deleted!")
                console.log("\n------------\n")
                askInit();
            })
        })
    })
};


// function to delete employee
let removeEmployee = () => {
    db.query("SELECT * FROM employee;", (err, data) => {
        removeEmployeeQuestion[0].choices = data.map((element) => ({value: element.id, name: element.first_name+" "+element.last_name}));
        inquirer.prompt(removeEmployeeQuestion)
        .then((response) => {
            db.query("DELETE FROM employee WHERE id = ?;", [response.whichEmployee], (err, data) => {
                console.log("\n--------------\n")
                console.log("Employee Removed!")
                console.log("\n--------------\n")
                askInit();
            })
        })
    })
};