//Init
showTasks(getDb());

document.querySelector('#avisos-data').addEventListener('submit', function (e) {
    e.preventDefault();


    var request = confirm("Publicar aviso?");
    if (request == true) {
        let formData = new FormData(this);
        var task = {};
        let keyStore = 0;
        let taskAppStore = getDb();

        for (var pair of formData.entries()) {
            task[pair[0]] = pair[1];
        }

        //Convierte la imagen para almacenarla en indexedDb
        var reader = new FileReader();
        reader.readAsBinaryString(task.picture);
        reader.onload = function (e) {
            task.picture = e.target.result;

            taskAppStore.length().then(function (numberOfKeys) {
                keyStore = numberOfKeys + 1;
                taskAppStore.setItem(JSON.stringify(keyStore), task);
            }).then(() => {
                showTasks(taskAppStore);
                document.querySelector('#avisos-data').reset();
            }).catch(err => {
                console.log(err);
            });
        }
    }
});

function showTasks(db) {
    document.querySelector('#tasks-container').innerHTML = '';
    db.keys().then(function (keys) {
        for (let key in keys) {
            db.getItem(keys[key]).then(function (value) {
                let task = value;
                let removeButton = createElement('button', null, ['button', 'danger', 'small','right',]);
                let container = createElement('div');
                let titulo = createElement('div');
                let description = createElement('div');
                let contact= createElement('div');
                //Lee la imagen almacenada en la indexedDb para convertirla a base64
                let img = createElement('img', keys[key], null, getImageFromBinary(task.picture));

                titulo.innerHTML = `<strong>${task.titulo.toUpperCase()}</strong>`;
                description.innerHTML = `<br>${task.description}`;
                contact.innerHTML = `<small>${task.contact}</small>`;
                
                img.setAttribute('width', '100px');
                img.setAttribute('heigh', '100px');

                removeButton.setAttribute('onclick', `removeAviso(${keys[key]})`);
                removeButton.textContent = 'Eliminar';

                container.appendChild(titulo);
                container.appendChild(description);
                container.appendChild(contact);
                // if(picture){

                container.appendChild(img);
                // }
                container.appendChild(removeButton);
                document.querySelector('#tasks-container').appendChild(container);
            });
        }
    }).catch(function (err) {
        console.log(err);
    });
}

function getImageFromBinary(imageData) {
    return 'data:image/jpeg;base64,' + btoa(imageData);
}

function getDb() {
    return localforage.createInstance({
        name: "avisosApp",
        version: 1,
        driver: localforage.INDEXEDDB
    });
}

function removeAviso(key) {
    db = getDb();
    db.removeItem(JSON.stringify(key)).then(function () {
        showTasks(db);
    }).catch(function (err) {
        console.log(err);
    });
}

function createElement(tagName, id = null, __class = null, src = null) {
    let element = document.createElement(tagName);
    element.setAttribute('id', (id == null) ? '' : id);

    if (Array.isArray(__class)) {
        __class.forEach(item => {
            element.classList.add(item);
        });
    } else {
        element.classList.add((__class == null) ? 'none' : __class);
    }

    if (tagName == 'img') {
        element.src = src;
    }

    return element;
}