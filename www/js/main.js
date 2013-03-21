var app = {

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    registerEvents: function () {
        $(window).on('hashchange', $.proxy(this.route, this));
        $('body').on('mousedown', 'a', function (event) {
            $(event.target).addClass('tappable-active');
        });
        $('body').on('mouseup', 'a', function (event) {
            $(event.target).removeClass('tappable-active');
        });
    },

    route: function () {
        var self = this;
        var hash = window.location.hash;
        if (!hash) {
            if (this.homePage) {
                this.slidePage(this.homePage);
            } else {
                this.homePage = new HomeView(this.store).render();
                this.slidePage(this.homePage);
            }
            return;
        }
        var match = hash.match(this.detailsURL);
        if (match) {
            this.store.findById(Number(match[1]), function (employee) {
                self.slidePage(new EmployeeView(employee).render());
            });
        }
    },

    slidePage: function (page) {

        var currentPageDest,
            self = this;

        // If there is no current page (app just started) -> No transition: Position new page in the view port
        if (!this.currentPage) {
            $(page.el).attr('class', 'page stage-center');
            $('body').append(page.el);
            this.currentPage = page;
            return;
        }

        // Cleaning up: remove old pages that were moved out of the viewport
        $('.stage-right, .stage-left').not('.homePage').remove();

        if (page === app.homePage) {
            // Always apply a Back transition (slide from left) when we go back to the search page
            $(page.el).attr('class', 'page stage-left');
            currentPageDest = "stage-right";
        } else {
            // Forward transition (slide from right)
            $(page.el).attr('class', 'page stage-right');
            currentPageDest = "stage-left";
        }

        $('body').append(page.el);

        // Wait until the new page has been added to the DOM...
        setTimeout(function () {
            // Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
            $(self.currentPage.el).attr('class', 'page transition ' + currentPageDest);
            // Slide in the new page
            $(page.el).attr('class', 'page stage-center transition');
            self.currentPage = page;
        });
    },

    checkConnection: function () {
        var networkState = navigator.network.connection.type;

        return networkState;

        //var states = {};
        //states[Connection.UNKNOWN] = 'Unknown connection';
        //states[Connection.ETHERNET] = 'Ethernet connection';
        //states[Connection.WIFI] = 'WiFi connection';
        //states[Connection.CELL_2G] = 'Cell 2G connection';
        //states[Connection.CELL_3G] = 'Cell 3G connection';
        //states[Connection.CELL_4G] = 'Cell 4G connection';
        //states[Connection.NONE] = 'No network connection';
    },
    
    displayConnection: function () {
        var networkState = navigator.network.connection.type;

        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.NONE] = 'No network connection';

        alert('Connection type: ' + states[networkState]);
    },


    initialize: function () {
        var self = this;
        this.detailsURL = /^#employees\/(\d{1,})/;
        this.registerEvents();

        this.store = new MemoryStore(function () {
            $(document).bind("deviceready", function () {
                alert("Checking connection");
                if (self.checkConnection() == Connection.NONE) {
                    // No internet, show the page
                    //alert("no connection, bounced");
                    navigator.app.loadurl("file:///android_asset/www/offline.html");
                } else {
                    // Continue?
                    // Redirect to normal mobile site?
                    navigator.app.loadUrl("https://www.jobinasecond.com");
                }
            });
            //self.route();
        });
    }

};

app.initialize();