"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const follow_routes_1 = __importDefault(require("./routes/follow.routes"));
const like_routes_1 = __importDefault(require("./routes/like.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.json({ message: 'API de Red Social funcionando correctamente' });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/posts', post_routes_1.default);
app.use('/api/comments', comment_routes_1.default);
app.use('/api/likes', like_routes_1.default);
app.use('/api/follow', follow_routes_1.default);
exports.default = app;
