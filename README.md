# 🚀 NestJS Backend Starter

A **production-ready NestJS backend application** covering all essential and advanced backend topics including authentication, authorization, database, caching, rate limiting, events, file uploads, and more.

This project is designed as a **solid reference / starter** for real-world applications.

---

## 🧱 Tech Stack

* **Framework:** NestJS
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** TypeORM
* **Auth:** JWT (Access & Refresh Tokens)
* **Authorization:** RBAC (Role-Based Access Control)
* **Caching:** Cache Manager (Redis / Memory)
* **Rate Limiting:** @nestjs/throttler
* **File Upload:** Multer
* **Validation:** class-validator & class-transformer

---

## 📁 Project Structure

```bash
src/
├── auth/              # Authentication & authorization
├── users/             # User module
├── posts/             # Example resource module
├── common/             # Shared utilities
│   ├── decorators/    # Custom decorators
│   ├── guards/        # Auth & role guards
│   ├── interceptors/  # Logging / transform interceptors
│   ├── middleware/    # Custom middleware
│   ├── pipes/         # Validation & parsing pipes
│   └── utils/         # Helpers & constants
├── database/          # TypeORM configuration
├── events/            # Event emitters & listeners
├── app.module.ts
└── main.ts
```

---

## ⚙️ Application Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables (`.env`)

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
```

### Run the App

```bash
npm run start:dev
```

---

## 🗄️ Database (PostgreSQL + TypeORM)

* Entity-based schema definition
* Auto migrations support
* Repository pattern

### Example Entity

```ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'USER' })
  role: UserRole;
}
```

---

## 📦 DTO (Data Transfer Objects)

DTOs ensure **validation**, **type safety**, and **clean APIs**.

```ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

Global validation pipe is enabled in `main.ts`.

---

## 🔐 Authentication (JWT)

* Login & Register
* Access Token & Refresh Token
* Password hashing using bcrypt

### JWT Strategy

```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() });
  }
}
```

---

## 🛂 Authorization (RBAC)

Role-based access using **Guards & Decorators**.

### Roles Decorator

```ts
@SetMetadata('roles', ['ADMIN'])
```

### Roles Guard

```ts
if (!roles.includes(user.role)) throw new ForbiddenException();
```

---

## 📤 File Upload (Multer)

Supports single & multiple file uploads.

```ts
@UseInterceptors(FileInterceptor('file'))
@Post('upload')
upload(@UploadedFile() file: Express.Multer.File) {}
```

* File validation
* Disk / cloud storage ready

---

## 🧠 Middleware

Used for request-level logic such as logging or request enrichment.

```ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.method, req.url);
    next();
  }
}
```

---

## 🎯 Interceptors

Used for:

* Response transformation
* Logging
* Performance tracking

```ts
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(ctx, next) {
    return next.handle().pipe(map(data => ({ data })));
  }
}
```

---

## ⚡ Caching

* Cache-first strategy
* Redis or in-memory

```ts
@Cacheable('posts')
findAll() {}
```

Improves performance and reduces DB load.

---

## 🚦 Rate Limiting

Protect APIs from abuse using throttling.

```ts
@Throttle(10, 60)
@Get()
findAll() {}
```

Configurable globally or per-route.

---

## 📡 Events (Event Emitter)

Decouple business logic using events.

```ts
this.eventEmitter.emit('user.created', user);
```

Listeners handle side effects like emails or logs.

---

## 📄 Pagination

Standard pagination using query params.

```ts
GET /posts?page=1&limit=10
```

```ts
const [data, total] = await repo.findAndCount({ skip, take });
```

---

## 🧪 Error Handling

* Global exception filter
* Consistent API error format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

---

## 📐 Best Practices

* Thin controllers, fat services
* Modular architecture
* Environment-based configs
* Reusable guards & decorators
* Clean commit messages

---

## 🧩 Future Enhancements

* Swagger API documentation
* Background jobs (BullMQ)
* WebSockets
* Microservices support

---

## 👨‍💻 Author

**Mohammad Nazim Hossain**
Full Stack Developer | NestJS | Node.js

---

## ⭐️ Support

If you find this project helpful, give it a ⭐️ and use it as your production-ready NestJS boilerplate.
