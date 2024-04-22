const inquirer = require('inquirer');
const db = require('./config/connection');

db.connect(err => {
    if (err) throw err;
    sql_employee_tracker();
});

var sql_employee_tracker = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View All Department', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Log Out']
    }]).then((response) => {
        if (response.prompt === 'View All Department') {
            db.query(`SELECT * FROM department`, 
							(err, result) => {
                if (err) throw err;
                console.log("Viewing All Departments: ");
                console.table(result);
                sql_employee_tracker();
            });
        } else if (response.prompt === 'View All Roles') {
            db.query(`SELECT * FROM role`, 
							(err, result) => {
                if (err) throw err;
                console.log("Viewing All Roles: ");
                console.table(result);
                sql_employee_tracker();
            });
        } else if (response.prompt === 'View All Employees') {
            db.query(`SELECT * FROM employee`, 
							(err, result) => {
                if (err) throw err;
                console.log("Viewing All Employees: ");
                console.table(result);
                sql_employee_tracker();
            });
        } else if (response.prompt === 'Add A Department') {
            inquirer.prompt([{
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Please Add A Department!');
                        return false;
                    }
                }
            }]).then((response) => {
                db.query(`INSERT INTO department (name) VALUES (?)`, [response.department], 
									(err, result) => {
                    if (err) throw err;
                    console.log(`Added ${response.department} to the database.`)
                    sql_employee_tracker();
                });
            })
        } else if (response.prompt === 'Add A Role') {
            db.query(`SELECT * FROM department`, 
							(err, result) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: 'input', name: 'role', message: 'What is the name of the role?',
                        validate: roleInput => {
                            if (roleInput) {
                                return true;
                            } else {
                                console.log('Please Add A Role!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input', name: 'salary', message: 'What is the salary of the role?',
                        validate: salaryInput => {
                            if (salaryInput) {
                                return true;
                            } else {
                                console.log('Please Add A Salary!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list', name: 'department', message: 'Which department does the role belong to?',
                        choices: () => {
                            var group = [];
                            for (var i = 0; i < result.length; i++) {
                                group.push(result[i].name);
                            }
                            return group;
                        }
                    }
                ]).then((response) => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].name === response.department) {
                            var department = result[i];
                        }
                    }
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [response.role, response.salary, department.id], 
											(err, result) => {
                        if (err) throw err;
                        console.log(`Added ${response.role} to the database.`)
                        sql_employee_tracker();
                    });
                })
            });
        } else if (response.prompt === 'Add An Employee') {
            db.query(`SELECT * FROM employee, role`, 
							(err, result) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: 'input', name: 'firstName', message: 'What is the employees first name?',
                        validate: firstNameInput => {
                            if (firstNameInput) {
                                return true;
                            } else {
                                console.log('Please Add A First Name!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input', name: 'lastName', message: 'What is the employees last name?',
                        validate: lastNameInput => {
                            if (lastNameInput) {
                                return true;
                            } else {
                                console.log('Please Add A Salary!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list', name: 'role', message: 'What is the employees role?',
                        choices: () => {
                            var group = [];
                            for (var i = 0; i < result.length; i++) {
                                group.push(result[i].title);
                            }
                            var latestGroup = [...new Set(group)];
                            return latestGroup;
                        }
                    },
                    {
                        type: 'input', name: 'manager', message: 'Who is the employees manager?',
                        validate: managerInput => {
                            if (managerInput) {
                                return true;
                            } else {
                                console.log('Please Add A Manager!');
                                return false;
                            }
                        }
                    }
                ]).then((response) => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === response.role) {
                            var role = result[i];
                        }
                    }
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [response.firstName, response.lastName, role.id, response.manager.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${response.firstName} ${response.lastName} to the database.`)
                        sql_employee_tracker();
                    });
                })
            });
        } else if (response.prompt === 'Update An Employee Role') {
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        type: 'list', name: 'employee', message: 'Which employees role do you want to update?',
                        choices: () => {
                            var group = [];
                            for (var i = 0; i < result.length; i++) {
                                group.push(result[i].last_name);
                            }
                            var employeeGroup = [...new Set(group)];
                            return employeeGroup;
                        }
                    },
                    {
                        type: 'list', name: 'role', message: 'What is their new role?',
                        choices: () => {
                            var group = [];
                            for (var i = 0; i < result.length; i++) {
                                group.push(result[i].title);
                            }
                            var latestGroup = [...new Set(group)];
                            return latestGroup;
                        }
                    }
                ]).then((response) => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].last_name === response.employee) {
                            var name = result[i];
                        }
                    }
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === response.role) {
                            var role = result[i];
                        }
										}
                    db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, result) => {
                        if (err) throw err;
                        console.log(`Updated ${response.employee} role to database.`)
                        sql_employee_tracker();
                    });
                })
            });
        } else if (response.prompt === 'Log Out') {
            db.end();
            console.log("Thank You");
        }
    })
};