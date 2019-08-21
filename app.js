var budgetController = (function() {
    function Income(obj) {
        this.id = obj.id;
        this.description = obj.description;
        this.value = obj.value;
    }

    function Expense(obj) {
        this.id = obj.id;
        this.description = obj.description;
        this.value = obj.value;
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

    return {
        addItem: function(obj) {
            var newItem, itemsArr;

            itemsArr = data.allItems[obj.type];

            // set item id
            if (itemsArr.length > 0) {
                obj.id = itemsArr[itemsArr.length - 1].id + 1;
            } else {
                obj.id = 1;
            }

            // add a new item

            if (obj.type === "inc") {
                newItem = new Income(obj);
            } else {
                newItem = new Expense(obj);
            }
            itemsArr.push(newItem);

            return newItem;
        },
        testing: function() {
            return data;
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

        // 2. Add the item to the budget controller
        var newItem = budgetController.addItem(input);
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