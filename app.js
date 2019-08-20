var budgetController = (function() {

})();

var UIController = (function() {

});

var controller = (function(budgetCtrl, UICtrl) {

    var ctrlAddItem = function() {
        console.log("add");
        // 1. Get the field input data

        // 2. Add the item to the budget controller

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    }

    document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

    document.addEventListener("keydown", function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
        
    });
})(budgetController, UIController);

