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
        this.percentage = obj.percentage;
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
                if(data.totals.inc > 0) {
                    obj.percentage = Math.round(obj.value / data.totals.inc * 100) + '%'; 
                } else {
                    obj.percentage = '---';
                }                
                newItem = new Expense(obj);
            }
            itemsArr.push(newItem);

            return newItem;
        },
        removeItem: function(arr) {
            var type, itemsArr;

            type = arr[0];
            if (type === "income") {
                type = "inc";
            } else if (type === "expense") {
                type = "exp";
            }

            itemsArr = data.allItems[type];

            data.allItems[type] = itemsArr.filter(function(item) {
                return item.id != arr[1];
            });
        },
        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

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
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        percentageItem: ".item__percentage"
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
                html += '+ ' + this.formatNumber(obj.value) + '</div>';
            } else if (type === "exp") {
                element = DOMstrings.expenseContainer;
                html += '- ' + this.formatNumber(obj.value) + '</div>';
                html += '<div class="item__percentage">' + obj.percentage + '</div>';
            }
            html += '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>';
            html += '</div></div></div>';

            //insert into dom
            document.querySelector(element).insertAdjacentHTML("beforeend", html);
        },
        deleteListItem: function(elem) {
            elem.parentNode.removeChild(elem);
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
            var budget = this.formatNumber(obj.budget);
            var totalInc = this.formatNumber(obj.totalInc);
            var totalExp = this.formatNumber(obj.totalExp);

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget > 0 ? "+" + budget : budget;
            document.querySelector(DOMstrings.incomeLable).textContent = obj.totalInc > 0 ? '+' + totalInc : totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp > 0 ? '-' + totalExp : totalExp; 
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage > 0 ? obj.percentage + '%' : '---';
        },
        // formatNumber(111111111.111) return '111,111,111.11'
        formatNumber: function(num) {
            num = num.toFixed(2);
            var numSplit = num.split('.');
            var strint = numSplit[0];
            var intLen = strint.length;
            var intArray = strint.split(""); // or Array.prototype.slice.call(strint)
            for(var i = intLen - 3; i > 0; i-=3) {                
                intArray.splice(i, 0, ',');
            }
            strint = intArray.join("");
            return strint + '.' + numSplit[1];
        }
    }
})();

var controller = (function(budgetCtrl, UICtrl) {

    function updateBudget(value) {
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

        // 4. Clear the fields
        UICtrl.clearFields();

        // 5. Calculate and update budget
        updateBudget(newItem.value);
    }

    function ctrlDeleteItem(event) {
        var target, element, typeAndId;
        // 1. get the deleted item
        target = event.target;
        element = target.parentNode.parentNode.parentNode.parentNode;
        typeAndId = target.parentNode.parentNode.parentNode.parentNode.id.split("-");
        console.log(typeAndId);

        // 2. remove item from budget controller
        budgetCtrl.removeItem(typeAndId);

        // 3. delete item from the UI
        UICtrl.deleteListItem(element);

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

        //delete income of expense event
        document.querySelector(DOMstrings.container).addEventListener('click', ctrlDeleteItem);
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
