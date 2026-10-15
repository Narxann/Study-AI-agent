from app.tools.all_tools import (
    add_course,
    add_assignment,
    add_course_resource,
    list_course_resources,
    add_course_note,
    list_course_notes,
    add_assignment_file,
    list_assignment_files
)


course = add_course(
    "Database",
    "CS204",
    "PostgreSQL болон SQL"
)

print("\nCOURSE")
print(course)


assignment = add_assignment(
    course["id"],
    "SQL Lab 8",
    "LATERAL query хийх",
    "2026-09-28",
    "18:00"
)

print("\nASSIGNMENT")
print(assignment)


resource = add_course_resource(
    course["id"],
    "PostgreSQL Documentation",
    "website",
    "https://www.postgresql.org/docs/",
    None,
    "PostgreSQL official documentation"
)

print("\nRESOURCE")
print(resource)

print("\nALL RESOURCES")
print(list_course_resources(course["id"]))


note = add_course_note(
    course["id"],
    "LATERAL",
    "LATERAL нь өмнөх FROM item-ийн мөр бүр дээр subquery ажиллуулах боломж олгодог."
)

print("\nNOTE")
print(note)

print("\nALL NOTES")
print(list_course_notes(course["id"]))


file = add_assignment_file(
    assignment["id"],
    "lab8.pdf",
    "uploads/assignments/lab8.pdf",
    2450000
)

print("\nFILE")
print(file)

print("\nALL FILES")
print(list_assignment_files(assignment["id"]))