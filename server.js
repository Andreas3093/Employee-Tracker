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

// add an employee to the database
const addEmployee = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input', 
                    message: "What is the employee's fist name? ",
                },
                {
                    name: 'last_name',
                    type: 'input', 
                    message: "What is the employee's last name? "
                },
                {
                    name: 'manager_id',
                    type: 'input', 
                    message: "What is the employee's manager's ID? "
                },
                {
                    name: 'role', 
                    type: 'list',
                    choices: function() {
                    const roleArray = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                    },
                    message: "What is this employee's role? "
                }
            ]).then(function (answer) {
                let role_id;
                for (let a = 0; a < res.length; a++) {
                    if (res[a].title == answer.role) {
                        role_id = res[a].id;
                        console.log(role_id)
                    }                  
                }  
                connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    manager_id: answer.manager_id,
                    role_id: role_id,
                },
                function (err) {
                    if (err) throw err;
                    console.log('Your employee has been added!');
                    options();
                })
            })
    })
}

// add a department to the database
const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'newDepartment', 
                type: 'input', 
                message: 'Which department would you like to add?'
            }
            ]).then(function (answer) {
                connection.query(
                    'INSERT INTO department SET ?',
                    {
                        name: answer.newDepartment
                    });
                var query = 'SELECT * FROM department';
                connection.query(query, function(err, res) {
                if(err)throw err;
                console.log('Your department has been added!');
                console.table('All Departments:', res);
                options();
                })
            })
};
