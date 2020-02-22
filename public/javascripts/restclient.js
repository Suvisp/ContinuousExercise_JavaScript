console.log("restclient");
document.addEventListener("DOMContentLoaded", init);
var topiclist;
var topicid;

function init() {
    console.log("DOM ladattu");
    document.getElementById("getbtn").addEventListener("click", gettopics)
    document.getElementById("createbtn").addEventListener("click", createtopics)
    document.getElementById("savebtn").addEventListener("click", savetopic)
    document.getElementById("deletebtn").addEventListener("click", deletetopic)
    topiclist = document.getElementById("topiclist");
    topiclist.addEventListener("click", gettopicforedit);
}

function gettopics(event) {
    topiclist.innerHTML = "";
    // console.dir(this);
    // console.dir(event);
    console.log("get topics");
    getTopicApi().then(topics => {
        // parseInt(topics);
        console.log(topics);
        let tempstring = "Click a Topic for Edit";
        // timeToMaster = Number(timeToMaster)
        for (let i = 0; i < topics.length; i++) {
            tempstring += `<li data-topic-id=${topics[i].id}>Topic: ${topics[i].title}, Description: ${topics[i].description}, Time to Master: ${topics[i].timetomaster} hours, Time Spent: ${topics[i].timespent} hours, Source: ${topics[i].source}, Start Date: ${(topics[i].startdate).substring(0, 10)}, in Progress: ${topics[i].inprogress}, Completion Date: ${(topics[i].completiondate).substring(0, 10)}.</li>`;
        }
        topiclist.innerHTML = tempstring;
    })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function getTopicApi() {
    return fetch("/api/topic")
        .then(res => res.json());
}

function createtopics() {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let timeToMaster = parseInt(document.getElementById("timeToMaster").value);
    let timeSpent = parseInt(document.getElementById("timeSpent").value);
    let source = document.getElementById("source").value;
    let startDate = document.getElementById("startDate").value;
    let inProgress = document.getElementById("inProgress").value;
    let completionDate = document.getElementById("completionDate").value;
    let newtopic = new Topic(title, description, timeToMaster, timeSpent, source, startDate, inProgress, completionDate);
    console.dir(newtopic)
    fetch("/api/topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newtopic)
    })
        .then(res =>
            res.json())
        .then((newtopic) => {
            console.dir(newtopic);
            gettopics();
        })
}

function gettopicforedit(event) {
    console.dir(event.target.dataset.topicId);
    topicid = event.target.dataset.topicId
    fetch("/api/topic/" + topicid)
        .then(res => res.json())
        .then(topic => {
            console.dir(topic);
            document.getElementById("edittitle").value = topic.title;
            document.getElementById("editdescription").value = topic.description;
            document.getElementById("edittimeToMaster").value = topic.timetomaster;
            document.getElementById("edittimeSpent").value = topic.timespent;
            document.getElementById("editsource").value = topic.source;
            document.getElementById("editstartDate").value = topic.startdate.substring(0, 10);
            document.getElementById("editinProgress").value = topic.inprogress;
            document.getElementById("editcompletionDate").value = topic.completiondate.substring(0, 10);
        })
    document.getElementById("editform").style.display = "block";
}

function savetopic() {
    let title = document.getElementById("edittitle").value;
    let description = document.getElementById("editdescription").value;
    let timeToMaster = parseInt(document.getElementById("edittimeToMaster").value);
    let timeSpent = parseInt(document.getElementById("edittimeSpent").value);
    let source = document.getElementById("editsource").value;
    let startDate = document.getElementById("editstartDate").value;
    let inProgress = document.getElementById("editinProgress").value;
    let completionDate = document.getElementById("editcompletionDate").value;
    let editedtopic = new Topic(title, description, timeToMaster, timeSpent, source, startDate, inProgress, completionDate, topicid);
    console.dir(editedtopic)
    fetch('/api/topic/' + topicid, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedtopic)
    }).then(res =>
        res.json())
        .then(message => {
            console.dir(message);
            document.getElementById("editform").style.display = "none";
            gettopics();
        })
}

function deletetopic() {
    console.dir("Deleting: " + topicid)
    fetch('/api/topic/' + topicid, {
        method: "DELETE"
    }).then(res => res.json()).then(message => {
        console.dir(message);
        document.getElementById("editform").style.display = "none";
        gettopics();
    })
}
class Topic {
    constructor(title, description, timeToMaster, timeSpent, source, startDate, inProgress, completionDate, id) {
        this.title = title;
        this.description = description;
        this.timeToMaster = timeToMaster
        this.timeSpent = timeSpent;
        this.source = source;
        this.startDate = startDate;
        this.inProgress = inProgress;
        this.completionDate = completionDate;
        this.id = id;
    }
}