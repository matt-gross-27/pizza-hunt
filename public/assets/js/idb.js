let db;

const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
  // save a reference to the database 
  const db = event.target.result;
  // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
  db.createObjectStore('new_pizza', { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;

  if (navigator.onLine) {
    // uploadPizza();
  }
};

request.onerror = function(event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(['new_pizza'], 'readwrite');
  const pizzaObjectStore = transaction.objectStore('new_pizza');
  pizzaObjectStore.add(record);
}

function uploadPizza() {
  const transaction = db.transaction(['new_pizza'], 'readwrite');
  const pizzaObjectStore = transaction.objectStore('new_pizza');
  const getAll = pizzaObjectStore.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('api/pizzas', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          const transaction = db.transaction(['new_pizza'], 'readwrite');
          const pizzaObjectStore = transaction.objectStore('new_pizza');
          pizzaObjectStore.clear();

          alert('All saved pizza has been submitted!');
        })
        .catch(err => console.log(err));
    }
  }
}

window.addEventListener('online', uploadPizza);