INSERT INTO department
  (name)
VALUES
  ('Engineering'),
  ('Sales'),
  ('Finance'),
  ('Legal');

INSERT INTO role
  (title, salary, department_id)
VALUES
("Lead Engineer", 100000, 1),
("Software Engineer", 95000, 1),
("Account Manager", 120000, 2),
("Accountant", 95000, 2),
("Legal Team Lead", 250000, 3),
("Lawyer", 190000, 3),
("Sales Lead", 100000, 4),
("Salesperson", 80000, 4);

INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
("Peter", "Parker", 1, null),
("Tony", "Stark", 2, 1),
("Bruce", "Banner", 3, null),
("Timmy", "Turner", 4, 2),
("Peter", "Quill", 5, null),
("Barry", "Allen", 6, 3),
("Bruce", "Wayne", 7, null),
("Rick", "Flag", 8, 4);