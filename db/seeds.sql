INSERT INTO department (name)
    VALUES ('SALES')
        ('ENGINEERING')
        ('FINANCE')
        ('LEGAL');

INSERT INTO role (title, salary, department_id)
    VALUES ('Sales Lead', 100000, 1)
    ('Salesperson' 80000, 1)
    ('Lead Engineer' 150000, 2)
    ('Software Engineer' 120000, 2)
    ('Account Manager' 160000, 3)
    ('Accountant' 125000, 3)
    ('Legal Team Lead' 250000, 4)
    ('Attorney' 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ('Jane', 'Doe', 1, 1)
        ('James', 'Xalis', 2)
        ('Miguel', 'Gallardo', 3, 2)
        ('Morgan', 'Tolman', 4, 2)
        ('Derrick', 'Lafforthun', 5, 3)
        ('Toacin', 'Patwary', 6)
        ('Disney', 'Man', 7, 4)
        ('Ian', 'Porter', 8);