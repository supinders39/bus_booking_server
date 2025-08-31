import AdminJSExpress from "@adminjs/express";
import * as AdminJsMongoose from "@adminjs/mongoose";
import { dark, light, noSidebar } from "@adminjs/themes";
import AdminJS from "adminjs";
import ConnectMongoDBSession from "connect-mongodb-session";
import dotenv from "dotenv";
import session from "express-session";
import Bus from "../models/bus.js";
import Ticket from "../models/ticket.js";
import User from "../models/user.js";
import { COOKIE_PASSWORD } from "./config.js";

dotenv.config();

AdminJS.registerAdapter(AdminJsMongoose)

const DEFAULT_ADMIN = {
    email: process.env.ADMIN_LOGIN_EMAIL,
    password: process.env.ADMIN_LOGIN_PASSWORD
};

const authenticate = async (email, password) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN)
    }
    return null
}

export const buildAdminJS = async (app) => {
    const admin = new AdminJS({
        resources: [{ resource: User }, { resource: Bus }, { resource: Ticket }],
        branding: {
            companyName: "Bus Booking",
            withMadeWithLove: false
        },
        defaultTheme: dark.id,
        availableThemes: [dark, light, noSidebar],
        rootPath: "/admin"
    });

    const MongoDBStore = ConnectMongoDBSession(session);
    const sessionStore = new MongoDBStore({
        uri: process.env.MONGO_URI,
        collection: "sessions"
    });

    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
        authenticate,
        cookieName: "adminjs",
        cookiePassword: COOKIE_PASSWORD,
    },
        null,
        {
            store: sessionStore,
            resave: true,
            saveUninitialized: true,
            secret: COOKIE_PASSWORD,
            cookie: {
                httpOnly: process.env.NODE_ENV === "production",
                secure: process.env.NODE_ENV === "production"
            },
            name: "adminjs"
        }
    );

    app.use(admin.options.rootPath, adminRouter)
}