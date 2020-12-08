let all_classrooms = [
    {
        id: 1,
        name: "Web Technology",
        description: "Subject Code : 17CS71, Teacher : Sushma H R, Classroom for taking quiz related to HTML, CSS and JS"
    },
    {
        id: 2,
        name: "Advanced Computer Architecture",
        description: "Subject Code : 17CS72, Teacher : Hemavathi, Classroom for taking quiz related to ACA"
    },
    {
        id: 3,
        name: "ML",
        description: "Subject Code : 17CS73, Teacher : Asha T"
    },
    {
        id: 4,
        name: "UNIX",
        description: "Teacher : Divyashree, Classroom for taking quiz related to unix"
    },
    {
        id: 5,
        name: "SAN",
        description: "Teacher : Nikhitha"
    },
    {
        id: 6,
        name: "Web Technology lab and Mini-project",
        description: ""
    },
    {
        id: 7,
        name: "ML LAb",
        description: "Teacher : Madhuri, Classroom for taking quiz related to ML lab"
    }
]



let menu_visible = false;
function toggle_dropdown() {
    let dd = document.getElementById("dropdown");
    if(menu_visible) {
        dd.classList.add("close");
        menu_visible=false;
    } else {
        dd.classList.remove("close");
        menu_visible=true;
    }
}
