# bcard

https://dam-bcard.com/

### Usage:

In the main page ('/') you can create your account.
Your password is being encrypted using the bcrypt library, even I can't see it.
You get your own special key that is randomly generated, which connects you to your account.

After you created your account, it's time to create your b-card!
Go ahead to /create, and start filling the fields, upload your logo and hit the create button - congrats! a new bcard has just born!

Your details are stored in a MongoDB database.

After that, you can manage your bcard through the /dashboard page, and change it's design.
There you have your basic information such as the amount of views your bcard got, a link to your bcard, and a QR code to share easily with your friends!


### Technologies In Use:

**front-end**: html, css, javascript, **Libraries**: aos, undraw.io, fontawesome, google-fonts.<br/>
**back-end**: node.js, ejs, **Libraries**: multer, bcrypt.<br/>
**database**: MongoDB, **Library**: Mongoose.<br/>
**Server**: DigitalOcean, **With**: Ubuntu VM, Nginx, **Domain**: OnlyDomains.com.<br/>
> Server Managment With Filezilla & Git.
