# Admin UI

## Overview

This repository contains the user interface for YANG Catalog's [admin section](https://yangcatalog.org/admin/login). 

The Admin UI is used for managing users, runing scripts
and reading logs. It also contains a panel with health checks to
quickly view the availability of YANG Catalog's services.

## User Manual

### Logging in

To log in go to yangcatalog.org/admin which will directly redirect you to datatracker.ietf.org login
page. This is a single sign on waypoint to many other applications together with yangcatalog.org. Once
successfully logged in, the session will be created and user remembered that he has been logged in.

You need to have account created and role assigned to be able to log in. There are two different roles in yangcatalog which allow different actions to the user, that can be performed on admin UI. These roles
are as follows:

-   **yc_operator**
-   **yc_admin**

Yangcatalog admin UI is split into several tabs where each tab has some different functionality.
**yc_admin** role has access to each of these functionalities. **yc_operator** has been stripped of reading,
updating and deleting yangcatalog and nginx config files, also he can not update or delete any other
file on from any directory only to read them.

### Tabs

-   **Healthcheck** - service and cronjob health checks to see if yangcatalog is working correctly
-   **Logs** - reading and filtering through different log files of yangcatalog.org
-   **Users** - reading and updating yangcatalog user database and granting them rights
-   **Config** - reading and updating yangcatalog config file
-   **Nginx** - reading yangcatalog nginx files
-   **Files** - reading updating and deleting files from main yangcatalog folder
-   **Actions** - running scripts (setting their options) and checking for their status

Following deeper description of each tab and instructions on how to use them

### Healthcheck

Healthcheck tab can be divided into two parts:

-   **Services Healthcheck**
-   **Cronjobs Healthcheck**

#### Services healthcheck

Services healthcheck check status of each of the running services at one minute intervals. By status check we mean sending a real request, which is processed by the service and the result is send back (e.g. validate RFC by YANG validator, or search for a specific module by YANG search etc.). The status of each service can acquire following 3 states:

-   **down** - Service is down and it is not possible to process the request.
-   **problem** - Service is running, but some problem occured during processing the request.
-   **running** - Service is running and the request was processed successfully.

#### Cronjob healthcheck

Unlike services healthcheck, the cronjobs healthcheck are not refreshed at one minute intervals. They simply show the status of the last cronjob run. Most of them are performed once a day, so there is no need to refresh. A cronjob can be in one of the following 3 states:

-   **In Progress** - The script is still running.
-   **Fail** - An error occurred while running the script.
-   **Success** - The script ran successfully, without errors.

#### Usage

This tab has mostly informative value, the background colors of individual headings corresponds to the status of service/cronjob runs (the same colors are used as for the traffic light). However, it is possible to click on reload button at services, to send request to the service manually. Also, if an error occurs while running the cron job, a small icon with letter "i" is displayed next to the name of job. After clicking on the icon, an error message will be displayed in the modal window. This "i" icon may also be available for some successful cronjobs or services, when additional information can be displayed after clicking.

### Logs

The logs tab is used to display and filter log messages from selected log files. Log messages are displayed from the newest to the oldest.
It is possible to display log messages from several log files at once. In this case the logs from first log file are displayed, followed by logs from second file etc. Following settings can be used within the log filter:

-   **Lines per page** - Number of log messages shown by one page
-   **Page** - Number of page to display
-   **Date from** - Filter logs from certain timestamp
-   **Date to** - Filter logs to certain timestamp
-   **Match case** - Case sensitive or not (used with Search for field)
-   **Match words** - Match only whole words, not substrings (used with Search for field)
-   **Level** - Select level of log messages (INFO, WARNING, DEBUG, ERROR)
-   **Search for** - Display rows which contain specified string
-   **Filter out** - Display rows which do not contain specified string

#### Usage

The filter provides several properties according to which log messages can be filtered. Each of this properties has default value in the case that user does not set its value. After clicking **Filter** button, log messages are displayed in table under the filter.

### Users

It is possible to perform CRUD operation over users tables, where information about users are stored. Currently there are two tables available:

-   **approved users**
-   **users waiting for approval**

#### Usage

The users tab provides CRUD functionality over both tables. Also there is extra approval functionality for users, that are stored in **users waiting for approval** table. After clicking on green check icon, modal window with the form is displayed. To successfully validate the user, it is necessary to fill in either SDO or Vendor access rights.

### Config

The config tab simply displays the content of the configuration file, which contains the individual configuration details of the yangcatalog.

#### Usage

Users with the permissions granted have the option to update the content of the configuration file by clicking on the **Edit** button. After applying the changes, it is necessary to click the **Save** button for saving changes. The save will automatically reload configuration of each service (e.g. backend, yang-search, yangvalidator ...) so it should take effect immediately and next usage of these services should use the newly set configuration variables.

### Nginx

The NGINX tab displays the content of the NGINX files. There are 3 NGINX files which can be displayed or edited.

#### Usage

This tab works exactly same like a config tab, except you are not able to update selected NGINX file.

### Files

The files tab provide reading, updating and deleting content of files from main yangcatalog folder. The information contained in this tab can be divided into two parts:

-   **Pie charts** - Charts display total disk usage and disk usage of selected folder
-   **Directory structure** - List of folders and corresponding files and sub-folders

#### Usage

Displayed pie charts are mainly for informational purposes only, it is possible to show disk usage of individual folders on hover at corresponding slices in chart. Second pie chart redraws after each click on the folder in directory structure.

Directory structure displays information about the size and permission of each file and folder. After clicking on user icon after name of file/folder permissions are displayed in modal window in more human-readable format. Files can be edited in the same way as config or NGINX files. It is also possible to delete files for users with the permissions granted.

### Actions

Last tab allows users to manually run some of the scripts that can be selected from the list. Each script has its own arguments, which can be set by user. Script itself and also each of the arguments has its own help message (on mouse hover on argument default value) to help the user better understand their meaning.
List of scripts that can be executed:

-   **populate** - Populate modules from a directory to Redis.
-   **parse_directory** - Parse modules in a given directory and generate a JSON with module metadata that can be populated to Redis.
-   **draftPull** - Pull the latest IETF files and upload them to Github. If there are new RFC files, produce an automated message that these need to be added to the yangModels/yang repository manualy.
-   **draftPullLocal** - Populate all new IETF modules from RFCs and I-Ds.
-   **openconfigPullLocal** - Populate all new Openconfig modules.
-   **ianaPull** - Populate all new IANA modules.
-   **statistics** - Generate the statistics page located at [yangcatalog.org/statistics.html](https://yangcatalog.org/statistics.html).
-   **recovery** - Load or restore YANG Catalog's modules and vendors databases. The file name defaults to the current date and time when saving, and to the last existing backup when loading.
-   **elkRecovery** (deprecated) - AWS provides Elasticsearch service and therefore this is managed by AWS at the moment
-   **elkFill** - Sets up all modules to be reprocessed by Elasticsearch.
-   **redis_users_recovery** - Load or restore the user database.
-   **resolveExpiration** - Resolve expiration metadata for each module and set it to actual state in Redis if changed.
-   **reviseSemver** - Revise the derived semantic version of modules.

#### Usage

The user first selects a script from the list. Then the arguments with their default values are displayed. The user also may or may not change the values of these arguments. Scripts are executed using RabbitMQ queue. Job ID is generated for every script execution, and this ID is stored in local storage. Job ID is used to verify the status of script execution, because it may take a few minutes to execute some scripts.

### Logging out

To logout press logout button which will remove all the created sessions and redirect user to [yangcatalog.org](https://yangcatalog.org/) page.

## Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.11.
Current Angular version is 10.2.5.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Docker build

Docker build will build the project using `ng build --base-href /admin/ --prod` and once built it will execute `cp` command to copy all the built files and directories of admin UI to a specific nginx admin directory with appropriate permissions. After this the container will shut itself down.