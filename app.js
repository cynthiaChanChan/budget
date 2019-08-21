var budgetController = (function() {
    function Income(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    function Expense(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }
})();

var UIController = (function() {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn"
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },
        getDOMstrings: function() {
            return DOMstrings;
        }
    }
})();

var controller = (function(budgetCtrl, UICtrl) {

    function ctrlAddItem() {
        
        // 1. Get the field input data
        var input = UICtrl.getInput();
        console.log(input);

        // 2. Add the item to the budget controller

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    }

    function setupEventListeners() {
        var DOMstrings = UICtrl.getDOMstrings();
        document.querySelector(DOMstrings.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keydown", function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
            
        });

    };

    return {
        init: function() {
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();