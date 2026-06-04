let trashNotes =
JSON.parse(localStorage.getItem("trashNotes")) || [];
import { db, auth } from "./firebase.js";
import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let notes = JSON.parse(localStorage.getItem("notes")) || [];


async function loadNotes(){

    notes = [];

    const querySnapshot =
    await getDocs(collection(db, "notes"));

    querySnapshot.forEach((doc) => {

        notes.push({
            id: doc.id,
            ...doc.data()
        });

    });

    displayNotes();
}



/* =========================
   INIT
========================= */
window.addEventListener("DOMContentLoaded", () => {
    loadNotes();
    setupSearch();
    setupFilter();
    setupWordCounter();
});
/* =========================
   ADD NOTE
========================= */
async function addNote() {

    const title = document.getElementById("title").value.trim();
    const category =
document.getElementById("category").value;
    const content = document.getElementById("content").value.trim();

    if (!title || !content) {
        alert("Please fill all fields");
        return;
    }

    const note = {
    title,
    content,
    category,
    date: new Date().toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }),
    pinned: false,
    favorite: false
};

    try {
        notes.push(note);

        localStorage.setItem("notes", JSON.stringify(notes));

        await addDoc(collection(db, "notes"), note);

        await loadNotes();

        document.getElementById("title").value = "";
        document.getElementById("content").value = "";

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

/* =========================
   DISPLAY NOTES
========================= */
function displayNotes() {

    const container = document.getElementById("notes-container");

    container.innerHTML = "";

    notes.forEach((note, index) => {

        const noteDiv = document.createElement("div");
        const colors = [
    "note-blue",
    "note-green",
    "note-purple",
    "note-orange",
    "note-pink"
];

noteDiv.classList.add(
    "note",
    colors[index % colors.length]
);

        noteDiv.innerHTML = `
    <h2>${note.title}</h2>
    <span class="category">
    ${note.category}
</span>
    <p>${note.content}</p>

    <small class="note-date">
        ${note.date}
    </small>

    <div class="btn-group">

    <button onclick="pinNote(${index})">
        ${note.pinned ? "📌 Unpin" : "📌 Pin"}
    </button>

    <button onclick="favoriteNote(${index})">
        ${note.favorite ? "⭐ Unfavorite" : "⭐ Favorite"}
    </button>

    <button onclick="shareNote(${index})">
    📤 Share
     </button>

    <button onclick="editNote(${index})">
        Edit
    </button>

    <button onclick="deleteNote(${index})">
        Delete
    </button>

</div>
`;

        container.appendChild(noteDiv);
    });
}

/* =========================
   DELETE NOTE
========================= */
function deleteNote(index) {

    if (!confirm("Delete this note?")) return;

    trashNotes.push(notes[index]);

notes.splice(index, 1);

localStorage.setItem(
    "notes",
    JSON.stringify(notes)
);

localStorage.setItem(
    "trashNotes",
    JSON.stringify(trashNotes)
);

displayNotes();

    localStorage.setItem("notes", JSON.stringify(notes));

    displayNotes();
}

/* =========================
   EDIT NOTE
========================= */
function editNote(index) {

    const newTitle = prompt("Edit Title", notes[index].title);
    const newContent = prompt("Edit Content", notes[index].content);

    if (!newTitle || !newContent) return;

    notes[index].title = newTitle;
    notes[index].content = newContent;

    localStorage.setItem("notes", JSON.stringify(notes));

    displayNotes();
}

/* =========================
   SEARCH SETUP
========================= */
function setupSearch() {

    const searchInput = document.getElementById("search");

    if (!searchInput) return;

    searchInput.addEventListener("input", function () {

        const text = this.value.toLowerCase().trim();

        if (text === "") {
            displayNotes();
            return;
        }

        const filtered = notes.filter(note =>
            note.title.toLowerCase().includes(text)
        );

        displayFilteredNotes(filtered);
    });
}

/* =========================
   FILTERED DISPLAY
========================= */
function displayFilteredNotes(filteredNotes) {

    const container = document.getElementById("notes-container");

    container.innerHTML = "";

    filteredNotes.forEach((note, index) => {

        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note");
        if(note.category === "Study"){
    noteDiv.classList.add("study");
}

if(note.category === "Work"){
    noteDiv.classList.add("work");
}

if(note.category === "Personal"){
    noteDiv.classList.add("personal");
}

        noteDiv.innerHTML = `
            <h2>${note.title}</h2>
            <p>${note.content}</p>

            <div class="btn-group">
                <button onclick="editNote(${index})">Edit</button>
                <button onclick="deleteNote(${index})">Delete</button>
            </div>
        `;

        container.appendChild(noteDiv);
    });
}
function pinNote(index){

    notes[index].pinned = !notes[index].pinned;

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

    displayNotes();
}

function favoriteNote(index){

    notes[index].favorite = !notes[index].favorite;

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

    displayNotes();
}
const themeBtn =
document.getElementById("theme-btn");

// Saved Theme Load
if(localStorage.getItem("theme") === "light"){
    document.body.classList.add("light-mode");
    themeBtn.innerHTML = "🌙 Dark Mode";
}else{
    themeBtn.innerHTML = "☀️ Light Mode";
}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    if(document.body.classList.contains("light-mode")){

        localStorage.setItem("theme","light");

        themeBtn.innerHTML = "🌙 Dark Mode";

    }else{

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML = "☀️ Light Mode";
    }
});
function setupFilter(){

    const filter =
    document.getElementById("filter");

    filter.addEventListener("change", function(){

        const selected =
        this.value;

        if(selected === "All"){
            displayNotes();
            return;
        }

        const filtered =
        notes.filter(note =>
            note.category === selected
        );

        displayFilteredNotes(filtered);
    });
}
function exportTXT(){

    let content = "";

    notes.forEach(note => {

        content +=
        `Title: ${note.title}\n`;

        content +=
        `Category: ${note.category}\n`;

        content +=
        `Content: ${note.content}\n`;

        content +=
        `Date: ${note.date}\n`;

        content +=
        `-------------------------\n\n`;
    });

    const blob = new Blob(
        [content],
        {type:"text/plain"}
    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download = "MyNotes.txt";

    link.click();
}
async function exportPDF(){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    notes.forEach((note,index)=>{

        doc.text(
            `${index+1}. ${note.title}`,
            10,
            y
        );

        y += 10;

        doc.text(
            `Category: ${note.category}`,
            10,
            y
        );

        y += 10;

        doc.text(
            note.content,
            10,
            y
        );

        y += 15;

        if(y > 260){
            doc.addPage();
            y = 20;
        }
    });

    doc.save("MyNotes.pdf");
}
function showTrash(){

    const container =
    document.getElementById("notes-container");

    container.innerHTML = "";

    trashNotes.forEach((note,index)=>{

        const noteDiv =
        document.createElement("div");

        noteDiv.classList.add("note");

        noteDiv.innerHTML = `
            <h2>${note.title}</h2>
            <p>${note.content}</p>

            <div class="btn-group">

                <button onclick="restoreNote(${index})">
                    Restore
                </button>

                <button onclick="permanentDelete(${index})">
                    Delete Forever
                </button>

            </div>
        `;

        container.appendChild(noteDiv);
    });
}
function restoreNote(index){

    notes.push(trashNotes[index]);

    trashNotes.splice(index,1);

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

    localStorage.setItem(
        "trashNotes",
        JSON.stringify(trashNotes)
    );

    displayNotes();
}

function permanentDelete(index){

    if(!confirm("Delete forever?"))
        return;

    trashNotes.splice(index,1);

    localStorage.setItem(
        "trashNotes",
        JSON.stringify(trashNotes)
    );

    showTrash();
}


function setupWordCounter(){

    const textarea =
    document.getElementById("content");

    textarea.addEventListener("input", () => {

        const text =
        textarea.value.trim();

        const words =
        text === ""
        ? 0
        : text.split(/\s+/).length;

        const chars =
        textarea.value.length;

        document.getElementById(
            "word-count"
        ).textContent = words;

        document.getElementById(
            "char-count"
        ).textContent = chars;
    });
}
async function shareNote(index){

    const note = notes[index];

    const shareText =
`Title: ${note.title}

Category: ${note.category}

${note.content}`;

    if(navigator.share){

        try{

            await navigator.share({
                title: note.title,
                text: shareText
            });

        }catch(error){
            console.log(error);
        }

    }else{

        alert(
            "Sharing is not supported in this browser."
        );
    }
}
async function logout() {

    try {

        await signOut(auth);

        alert("Logged Out Successfully");

        window.location.href =
        "../login/login.html";

    } catch(error) {

        alert(error.message);

    }

}


/* =========================
   GLOBAL FUNCTIONS
========================= */
window.addNote = addNote;
window.deleteNote = deleteNote;
window.editNote = editNote;
window.pinNote = pinNote;
window.favoriteNote = favoriteNote;
window.exportTXT = exportTXT;
window.exportPDF = exportPDF;

window.showTrash = showTrash;
window.restoreNote = restoreNote;
window.permanentDelete = permanentDelete;
window.shareNote = shareNote;
window.logout = logout;