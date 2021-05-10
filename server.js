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

const options = () => {
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
                    connection.end();
                    break;
                default:
                    console.log(`Invalid Action: ${answer.action}`);
                    break;
            }
        })
}

//view all employees in the database
const viewEmployees = () => {
    const query = 'SELECT * FROM employee';
    connection.query(query, (err, res) =>{
        if (err) throw err;
        console.log(res.length + ' Employees Found!');
        console.table('All Employees', res);
        options()
    })
}

// view all departments in the database
const viewDepartments = () => {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].name);
    }
    options()
    });
}

// view all roles in the database
const viewRoles = () => {
    const query = 'SELECT * FROM role';
    connection.query(query, (err, res) =>{
        if (err) throw err;
        console.table('All Roles', res);
        options()
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
            ]).then((answer) => {
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
            ]).then((answer) => {
                connection.query(
                    'INSERT INTO department SET ?',
                    {
                        name: answer.newDepartment
                    });
                const query = 'SELECT * FROM department';
                connection.query(query, function(err, res) {
                if(err)throw err;
                console.log('Your department has been added!');
                console.table('All Departments:', res);
                options();
                })
            })
};

// add a role to the database
const addRole = () => {
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;
    
        inquirer 
        .prompt([
            {
                name: 'new_role',
                type: 'input', 
                message: "What new role would you like to add?"
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this role? (Enter a number)'
            },
            {
                name: 'Department',
                type: 'list',
                choices: function() {
                    const deptArry = [];
                    for (let i = 0; i < res.length; i++) {
                    deptArry.push(res[i].name);
                    }
                    return deptArry;
                },
            }
        ]).then((answer) => {
            let department_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name == answer.Department) {
                    department_id = res[a].id;
                }
            }
    
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.new_role,
                    salary: answer.salary,
                    department_id: department_id
                },
                (err, res) => {
                    if(err)throw err;
                    console.log('Your new role has been added!');
                    console.table('All Roles:', res);
                    options();
                })
        })
    })
};

// update a role in the database
const updateRole = () => {
    inquirer
        .prompt({
            name: "id",
            type: "input",
            message: "Enter employee id",
        }).then((answer) => {
            let id = answer.id;

            inquirer
                .prompt({
                    name: "roleId",
                    type: "input",
                    message: "Enter role id",
                }).then((answer) => {
                    const roleId = answer.roleId;
                    const query = "UPDATE employee SET role_id=? WHERE id=?";
                    connection.query(query, [roleId, id], (err, res) => {
                        if (err) throw err;
                        console.log('Your role has been updated!');
                        console.table('Update Role:', res);
                        option()
                    })
                })
        })
}

//  delete an employee
const deleteEmployee = () =>{
    inquirer
        .prompt({
            name: "deleteEmployee",
            type: "input",
            message: "To REMOVE an employee, enter the Employee id",
        }).then((answer) => {
            const query = 'DELETE FROM employee WHERE?';
            const newId = Number(answer.deleteEmployee);
            console.log(newId);
            connection.query(query, {id: newId}, (err, res) => {
                if (err) throw err
                console.log('Employee has been removed!');
                console.table('Employee Remove:', res);
                options()
            })
        })

};
