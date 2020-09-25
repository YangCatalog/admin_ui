# MANUAL

This document serves as a manual for yc_operator and yc_admin role. If any problem found with the
admin_ui or this manual please open github issue in this repository immediately.

## yc_operator

Operator`s tasks follows

### yangcatalog status

The yangcatalog **MUST** run healthy at all times and therefor an operator is responsible to make sure
it is. To do so follow these steps:

1. sign in to yangcatalog admin page
2. select healthcheck tab
3. wait for all heathcheck to provide information
4. if all green yangcatalog is running healthy
5. if there is any of them yellow or red there is a problem

if there is a problem with any of the services or cronjobs please get the provided information and
also check for any logs. To check the logs do the following:

1. sign in to yangcatalog admin page
2. select logs tab
3. choose the log or logs that are be most appropriate to the service or cronjob
4. hit filter

if there are too many logs you can filter out appropriately. In the selected log tab you should choose
at least lever error or warning and if you know when the problem appeared date from would make sense as well.
Or you can try to serch for the word error in any of the text using the search for placeholder.

With the provided information from the healthcheck tab and log file and any additional description you can
provide please open github issue on [yangcatalog github issue page](https://github.com/YangCatalog/deployment/issues)

### managing users

Operator is reponsible to make sure that all the yangcatalog users have assigned their `access rights sdo` and `access rights vendor` 
if the have any. Each yangcatalog user after signing in receives a message that he needs to wait for
approval from yangcatalog and the rights will be given to him. To do this use following steps:

1. sign in to yangcatalog admin page
2. select users tab
3. from drop down selection, choose `users waiting for approval`
4. hit load category and the list of users waiting for approval will appear
5. hit the tick symbol of any user that you want to approve (symbol is at the end of the row)
6. fill in either access rights sdo or access rights vendor or both of them
7. hit submit

after hitting submit button a user will be moved from the `users waiting for approval` table to
`approved users` table.

Operator is also responsible to keep the information of users updated at all times. If he changed any
of provided information it is needed to be updated as follows:

1. sign in to yangcatalog admin page
2. select users tab
3. from drop down selection, choose `approved users`
4. hit load category and the list of users will appear
5. hit the pen symbol of any user that you want to update (symbol is at the end of the row)
6. fill in all the data about the user you are updating
7. hit submit

If the user no longer exists operator needs to remove him as well as follows:

1. sign in to yangcatalog admin page
2. select users tab
3. from drop down selection, choose `approved users`
4. hit load category and the list of users will appear
5. hit the 'x' symbol of any user that you want to remove (symbol is at the end of the row)

### running scripts

In all the following scripts to track the job status check the right hand side of actions tab.
With each of the running script by you the job id is generated and tracked with its status which
can be done, in progress or failed.

If we are missing some of the modules and we are sure that they are provided in yangModels/yang
github repository we need to run script to populate them manually. 

1. sign in to yangcatalog admin page
2. select actions tab
3. from drop down menu choose populate
4. in options change only dir value to `/var/yang/nonietf/yangmodels/yang/` + directory from the
 yangmodels/yang repository. (E.g. ietf RFCs would be `/var/yang/nonietf/yangmodels/yang/standard/ietf/RFC`)
5. in options check the notify indexing checkbox
6. in options check the sdo option if you want all the yang modules to be populated or do not check if
you want to validate all the modules based on xml hello message from within the directory
7. hit execute and track the job

If draft pull job failed and you don t see any bug or apparent reason for this you can rerun this job
as follows:

1. sign in to yangcatalog admin page
2. select actions tab
3. from drop down menu choose draftPull
4. from options check the send message checkbox
5. hit execute and track the job

If draft pull local job failed and you don t see any bug or apparent reason for this you can rerun this job
as follows:

1. sign in to yangcatalog admin page
2. select actions tab
3. from drop down menu choose draftPullLocal
4. hit execute and track the job
5. from drop down menu choose openconfigPullLocal
6. hit execute and track the job

[Statistics page](https://yangcatalog.org/statistics.html) is generated on daily basis. On its page you can find
generated on with the date. If the date is not today or previous day in case this day was not yet run an operator
is reponsible to make sure this will be executed. To do so he follows these steps:

1. sign in to yangcatalog admin page
2. select actions tab
3. from drop down menu choose statistics
4. hit execute and track the job

If we are unable to load any of the module in yangcatalog.org the confd database is most likely empty.
This should never happen in any case. This needs to be reported immediately (or github issue opened). To
load all the modules from last saved cache (which is done on daily basis), you follow these steps:
 
1. sign in to yangcatalog admin page
2. select actions tab
3. from drop down menu choose recovery
4. from options remove name save
5. from options write 'save' in Type option
6. leave other options as is
7. hit execute and track the job

If resolve expiration job failed and you don t see any bug or apparent reason for this or some of the
module expiration are not valid you can run this job as follows:

1. sign in to yangcatalog admin page 2. select actions tab
3. from drop down menu choose resolveExpiration
4. leave the options as are
5. hit execute and track the job

## yc_admin

Admin is responsible for all of the yc_operator tasks as well as for the following tasks.

### updating config file

If we change any of the passwords to databases or any of the links that come from yangcatalog
config file admin is responsible to keep the config file updated as well. To do so he follows
these instructions:

1. sign in to yangcatalog admin page
2. select config tab
3. hit edit button
4. make appropriate changes
5. hit save
6. confirm

These changes will take effect immediately after confirmation therefore please make sure that the
changes you have made are valid otherwise it may have critical impact on yangcatalog functionality.

### Unable to index

Only one indexing can run at the time which will prevent from wrong data submitting to elasticsearch.
While the indexing is running a lock file is created in temp folder of yangcatalog. This should exist
only while the indexing is running. If the job is done or failed and the lock file was not removed for
some reason we need to make sure it will be removed manually. To make sure that job is done follow these
steps:

1. sign in to yangcatalog admin page
2. select files tab
3. wait until loaded
4. click tmp folder
5. find rest-of-elk-date.json and make sure this has size of 2B
6. if it has more let the job run or check if it did not fail
7. if it has 2B job is done follow next steps

To remove lock file follow these steps:

1. sign in to yangcatalog admin page
2. select files tab
3. wait until loaded
4. click tmp folder
5. find any of the *.lock file
6. remove it using the trash can symbol (this can be find at the end of the selected file)
7. confirm

To find out if the job failed follow these steps.

1. sign in to yangcatalog admin page
2. select log tab
3. from drop down menu choose process-changed-mods
4. if log message `No new modules are added or removed. Exiting script!!!` and log message 
`Initializing script loading config parameters` is repeated in this order for over 20 times,
it has been failed and is not running.

Other option how to check for the job running is to go directly to webserver using ssh and conect
to the yc_search container and list for all the jobs running using `ps -aux` and search for
process-changed-mods.
