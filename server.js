const mysql = require('mysql');
const inquirer = require('inquirer')
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employees_db'
})

connection.connect(function(err){
    if (err) throw err;
    options();
})

const option = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'Welcome to our employee database! What would you like to do?',
            choices: [
                    'View all employees',
                    'View all departments',
                    'View all roles',
                    'Add an employee',
                    'Add a department',
                    'Add a role',
                    'Update employee role',
                    'Delete an employee',
                    'EXIT'
            ]
        }).then((answer) => {
            switch(answer.action) {
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Update employee role':
                    updateRole();
                    break;
                case 'Delete an employee':
                    deleteEmployee();
                    break;
                case 'EXIT':
                    exitApp();
                    break;
                default:
                    break;
            }
        })
}

// view all employees in the database
const viewEmployees = () => {
    const query = 'SELECT * FROM employee';
    connection.query(query, (err, res) =>{
        if (err) throw err;
        console.log(res.length + ' Employees Found!');
        console.table('All Employees', res);
        option()
    })
}

// view all departments in the database
const viewDepartments = () => {
    const query = 'SELECT * FROM department';
    connection.query(query, (err, res) =>{
        if (err) throw err;
        console.table('All Deparments', res);
        option()
    })
}

// view all roles in the database
const viewRoles = () => {
    const query = 'SELECT * FROM role';
    connection.query(query, (err, res) =>{
        if (err) throw err;
        console.table('All Roles', res);
        option()
    })
}