INSERT INTO department (name)
    VALUES ('SALES'),
        ('ENGINEERING'),
        ('FINANCE'),
        ('LEGAL');

INSERT INTO role (title, salary, department_id)
    VALUES ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Attorney', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ('Jane', 'Doe', 1, NULL),
        ('James', 'Xalis', 2, 1),
        ('Miguel', 'Gallardo', 3, NULL),
        ('Morgan', 'Tolman', 4, 3),
        ('Derrick', 'Lafforthun', 5, NULL),
        ('Toacin', 'Patwary', 6, 5),
        ('Austin', 'Liddicoat', 7, NULL),
        ('Ian', 'Porter', 8, 7);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;