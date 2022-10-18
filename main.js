
const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKS_APPS';

function generateId() {
    return +new Date();
  }

  function generateBookObject(id, title, author,year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    };
  }
  
  function findBooks(bookid){
    for(const bookItem of books){
        if(bookItem.id === bookid){
            return bookItem;
        }
    }
    return null
  }
  function findBookIndex(bookid) {
    for (const index in books) {
      if (books[index].id === bookid) {
        return index;
      }
    }
    return -1;
  }
  


  function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }
  
  function saveData() {
    if (isStorageExist()) {
      const parsed /* string */ = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }


  function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function makeBook(bookObject){
    const {id, title, author,year, isCompleted}=bookObject;
    
    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Penulis:"+ author;

    const textYear = document.createElement('p');
    textYear.innerText = "Tahun:"+ year;

    const bookButton = document.createElement('div');
    bookButton.classList.add('action');

    const undoIcon = document.createElement('i');

    undoIcon.classList.add('fa-solid','fa-rotate-left');

    const deleteIcon = document.createElement('i');

    deleteIcon.classList.add('fa-solid','fa-trash');

    const checkIcon = document.createElement('i');

    checkIcon.classList.add('fa-solid','fa-check');
    
    
    const textcontainer = document.createElement('article');
    textcontainer.classList.add('book_item');
    textcontainer.append(textTitle,textAuthor,textYear);
    textcontainer.append(bookButton);
    textcontainer.setAttribute('id', `book -${bookObject.id}`)

    if(isCompleted){
        const undoBotton = document.createElement('button');
        undoBotton.classList.add('green')
        undoBotton.innerText = "Baca lagi ";
        undoBotton.append(undoIcon);
        undoBotton.addEventListener('click',function(){
            undoTaskFromCompleted(bookObject.id);
            Swal.fire(
                'Buku Siap dibaca lagi!',
                'You clicked the button!',
                'success'
              )
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = "Hapus "
        trashButton.append(deleteIcon);
        trashButton.addEventListener('click', function(){
            removeTaskFromCompleted(bookObject.id);
            Swal.fire(
                'Delete Berhasil!',
                'You clicked the button!',
                'success'
              )
        });

        bookButton.append(undoBotton,trashButton);
    }else{
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = "Selesai "
        checkButton.append(checkIcon);
        checkButton.addEventListener('click',function(){
            addTaskToCompleted(id);
            Swal.fire(
                'Buku selesai di baca!',
                'You clicked the button!',
                'success'
              )
        });


        const trashButton = document.createElement('button');
        trashButton.classList.add('red')
        trashButton.innerText = "Hapus "
        trashButton.append(deleteIcon);
        trashButton.addEventListener('click', function(){
            removeTaskFromCompleted(id);
            Swal.fire(
                'Delete Berhasil!',
                'You clicked the button!',
                'success'
              )

        });

        bookButton.append(checkButton,trashButton);
    }
    return textcontainer;
  }

  function addBooks(){
    const textBooks = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYear = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const generateID =  generateId();
    const booksObject = generateBookObject(generateID,textBooks,textAuthor,textYear,isCompleted);
    books.push(booksObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  
  function addTaskToCompleted(booksid){
    const bookTarget = findBooks(booksid);
    if(bookTarget == null)return;
    
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function removeTaskFromCompleted(booksid){
    const bookTarget = findBookIndex(booksid);

    if(bookTarget === -1 )return;

    books.splice(bookTarget,1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function undoTaskFromCompleted(booksid){
    const bookTarget = findBooks(booksid);
    
    if(bookTarget == null)return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  document.addEventListener('DOMContentLoaded',function(){
    const submitform = document.getElementById('inputBook');

    submitform.addEventListener('submit',function(event){
        event.preventDefault();
        addBooks();
        Swal.fire(
            'Berhasil tersimpan!',
            'You clicked the button!',
            'success'
          )
    });
    if(isStorageExist()){
        loadDataFromStorage();
    }
  });

  document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan.');
  });

  document.addEventListener(RENDER_EVENT, function(){
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    const listComplated = document.getElementById('completeBookshelfList');

    uncompletedBookList.innerHTML = '';
    listComplated.innerHTML= '';

    for(const bookitem of books){
        const booksElement = makeBook(bookitem);
        if(bookitem.isCompleted){
            listComplated.append(booksElement);
        }else{
            uncompletedBookList.append(booksElement);

        }
    }
  });

  document.getElementById("searchSubmit").addEventListener("click", (event) => {
    const input = document.getElementById("searchBookTitle").value.toLowerCase();
    const bookList = document.querySelectorAll("h3");
   
    for (let book of bookList) {
      const title = book.textContent.toLowerCase();
      console.log(title);
      if (title.includes(input)) {
        book.parentElement.style.display = "block";
      } else {
        book.parentElement.style.display = "none";
      }
    }
    event.preventDefault();
  });