const AddWall = document.querySelector('.add-wall');
const BtnSet1 = document.querySelector('.btn-set1');
const BtnSet2 = document.querySelector('.btn-set2');


// add entry button - opens add window
document.querySelector('.add-record').addEventListener('click', function(){
  AddWall.style.display = 'flex';
});

// add window close button
document.querySelector('.add-cancel').addEventListener('click', function(){
  AddWall.style.display = 'none';
});
