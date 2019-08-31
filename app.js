var budgetController = (function() {
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

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

    function calculateTotal(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
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
            } else if (obj.type === "exp"){
                newItem = new Expense(obj);
            }
            itemsArr.push(newItem);

            return newItem;
        },
        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp

            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
        },
        testing: function() {
            return data;
        },
        getBudget: function () {
            return {
                totalExp: data.totals.exp,
                totalInc: data.totals.inc,
                budget: data.budget,
                percentage: data.percentage
            }
        }
    }
})();

var UIController = (function() {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLable: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage"
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value.trim(),
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        getDOMstrings: function() {
            return DOMstrings;
        },
        addListItem: function(obj, type) {
            var html, element, typeName;

            typeName = type === "inc" ? 'income' : 'expense';
            
            //item htmlString
            html = '<div class="item clearfix" id="' + typeName + '-' + obj.id + '">';
            html += '<div class="item__description">' + obj.description + '</div>';
            html += '<div class="right clearfix"><div class="item__value">';
            if (type === "inc") {
                element = DOMstrings.incomeContainer;
                html += '+ ' + obj.value + '</div>';
            } else if (type === "exp") {
                element = DOMstrings.expenseContainer;
                html += '- ' + obj.value + '</div>';
                html += '<div class="item__percentage">21%</div>';
            }
            html += '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>';
            html += '</div></div></div>';

            //insert into dom
            document.querySelector(element).insertAdjacentHTML("beforeend", html);
        },
        clearFields: function() {
            var fields;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);
            //NodeList is not an Array, it is possible to iterate over it with forEach(), 
            //so no need to convert to array using slice;
            // fieldsArr = Array.prototype.slice.call(fields); 
            fields.forEach(function(current) {
                current.value = "";
            });
            fields[0].focus();
        },
        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget > 0 ? "+" + obj.budget : obj.budget;
            document.querySelector(DOMstrings.incomeLable).textContent = obj.totalInc > 0 ? '+' + obj.totalInc : obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp > 0 ? '-' + obj.totalExp : obj.totalExp; 
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage > 0 ? obj.percentage + '%' : '---';
        }
    }
})();

var controller = (function(budgetCtrl, UICtrl) {

    function updateBudget() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    function ctrlAddItem() {
        var input, newItem;
        // 1. Get the field input data
        input = UICtrl.getInput();

        if (input.description == "" || input.value <= 0 || isNaN(input.value)) {
            return;
        }
        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input);
        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        UICtrl.clearFields();
        // 4. Calculate and update budget
        updateBudget();
       
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
            var budget = {
                totalExp: 0,
                totalInc: 0,
                budget: 0,
                percentage: -1
            }
            updateBudget(budget);
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();