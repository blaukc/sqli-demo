import json

# Load JSON data from file
with open('response_1730708106465.json') as f:
    modules = json.load(f)

# Generate SQL INSERT statements
with open('insert_courses.sql', 'w') as sql_file:
    insert_statements = []
    for module in modules:
        module_code = module["moduleCode"]
        course_name = module["title"].replace("\'", "")
        description = module["description"].replace("\'", "")
        if len(description) > 50:
            description = description[:50] + "..."

        sql_statement = f"INSERT INTO courses (course_code, course_name, description) VALUES ('{module_code}', '{course_name}', '{description}');\n"
        sql_file.write(sql_statement)

