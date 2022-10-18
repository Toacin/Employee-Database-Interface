const inquirer = require("inquirer");
const db = require("./db/connection.js");

db.connect((error) => {
    if (error) throw error;
    console.log("Successfully connected to database");
    askInit();
})

let initialQuestion = [
    {
        type: "list",
        name: "whatToDo",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "Add Employee",
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department",
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
        choices: ["SALES", "ENGINEERING", "FINANCE", "LEGAL"]
    }
]

function askInit () {
    inquirer.prompt(initialQuestion).then((answers) => {
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
            case "Add Employee":
                addRole();
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

let getEmployees = () => {
    db.query("SELECT * FROM employee;", (err, data) => {
        console.table(data);
        askInit();
    })
};

let getRoles = () => {
    db.query("SELECT * FROM role;", (err, data) => {
        console.table(data);
        askInit();
    })
};

let getDepartments = () => {
    db.query("SELECT * FROM department;", (err, data) => {
        console.table(data);
        askInit();
    })
};

let addDepartment = () => {
    inquirer.prompt(whatDepartment)
    .then((response) => {
        db.query(`INSERT INTO department (name) VALUES (?);`, [response.departmentName], (err, data) => {
            console.log("New department has been successfully added!")
            askInit();
        })
    })
};

let addRole = () => {
    inquirer.prompt(whatRole)
    .then((response) => {
        let departID;
        switch (response.whichDepart) {
            case "SALES": departID = 1;
                break;
            case "ENGINEERING": departID = 2;
                break;
            case "FINANCE": departID = 3;
                break;
            case "LEGAL": departID = 4;
                break;
            default:
                break;
        }
        db.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?);`, [response.roleName, response.salary, departID], (err, data) => {
            console.log("New role has been successfully added!")
            askInit();
        })
    })
};