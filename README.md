# Tender Procurement Management System

## Overview

This project is a **Tender Procurement Management System** designed to streamline the process of creating, managing, and evaluating tenders. It allows tenderers, procurement teams, and administrators to handle the full lifecycle of a tender, including placing bids, managing tenderers, evaluating bids, and sending communications. The app supports both English and Mandarin languages and includes robust permissions to ensure that only authorized users can access or modify specific content.

## Features

### 1. **User Management**
   - **User Roles**: Multiple roles are supported, including:
     - **Admin**
     - **Tenderer**
     - **Tender Procurement Group**
     - **Secretary**
   - **Admin Features**:
     - Manage user roles (e.g., tenderer, procurement group).
     - Create and delete users.
     - Update user information (email, phone number, password, and role).
     - View and manage tenderer details.
     - View and manage tender records.
   - **Tenderer Features**:
     - View and place bids on active tenders.
     - View own bids.
     - Update company details before submitting bids.

### 2. **Tender Creation and Management**
   - **Tender Creation**: Authorized users can create new tenders, specifying:
     - Issue date
     - Closing date
     - Contact information
     - Related files
   - **Tender Management**:
     - View and edit tenders.
     - Automated tender status updates via cron jobs (Node js)
     - Upload related files for each tender.
     - Track who uploaded each file and when.
     - Specify targeted users and procurement group members for each tender.
     - Prevent tender editing after closure.

### 3. **Bid Management**
   - **Bid Submission**: Tenderers can place bids on open tenders.
   - **Bid Viewing**: The Tender Procurement Group can collectively agree to open bids for viewing after tender closure.
   - **Bid Evaluation**: After tender closure, authorized users can evaluate bids and select the  bids for negotiation.
   - **Bid Notification**: Notify the negotiation candidate tenderer via email.

### 4. **Tenderer Management**
   - **Tenderer Database**: A list of tenderers is maintained, allowing admins and secretaries to manage them.
   - **Tenderer Creation**: Secretaries can create tenderers with automatic password generation.
   - **Tenderer Details**: Store legal representative, business type, and other details.

### 5. **Inbox and Communication**
   - **Inbox System**: Users receive tender-related messages. They can:
     - Mark mails as read/unread
     - Delete mails
     - Select multiple mails in bulk
   - **Mail Notifications**: Tenderers receive emails when they win a bid.

### 6. **Chat System**
   - **Tender-Specific Chat**: A chat system is integrated into each tender page where users can discuss tender-related questions.

### 7. **Language Support**
   - **Mandarin and English**: Toggle between languages easily.
   - **Localized Error Messages**: Display error messages and system notifications in both languages.

### 8. **Security and Authentication**
   - **Login System**: Supports both email/password and SMS-based login. The current implentation uses Aliyun, a Chinese SMS provision service. Feel free to change this if needed (checkout the sms and verification routes, models, and controllers in the backend)
   - **Session Tracking**: Track login, logout, and file download activities.

### 9. **Admin Settings**
   - **Settings Management**: Admins can configure system settings.
   - **Search and Filter**: Admins can search and filter users in the admin management section.

### 10. **Additional Features**
   - **File Type Restrictions**: Enforce valid file uploads on both frontend and backend.
   - **Cron Jobs**: Automatically update tender statuses (e.g., from open to closed). Delete verification codes periodically.
   - **Frontend/Backend Integration**: The app uses the MERN stack (MongoDB, Express, React, Node.js) to run frontend and backend concurrently.

## How to Run

1. **Local Setup**:
   - Install MongoDB locally or connect to a cloud instance.
   - Clone the project repository.
   - Run `npm install` or `yarn install` in both the frontend and backend directories.
   - Set environment variables (e.g., `ATLAS_URI`) in a `.env` file for both the frontend and backend. Checkout .env.example for reference.
   - Start the app by running `npm run dev` in the root folder. The logs are automatically appended to frontend.log and backend.log

2. **Deploying to the Cloud**:
   - Update environment variables for production.
   - Use services like Heroku or AWS for backend hosting, and services like Netlify for frontend deployment.

# 招标采购管理系统

## 概述

该项目是一个**招标采购管理系统**，旨在简化招标的创建、管理和评估过程。它允许投标人、采购团队和管理员处理招标的整个生命周期，包括提交投标、管理投标人、评估投标以及发送通知。该应用支持英语和普通话两种语言，并且包含强大的权限管理，以确保只有授权用户才能访问或修改特定内容。

## 功能

### 1. **用户管理**
   - **用户角色**：支持多种角色，包括：
     - **管理员**
     - **投标人**
     - **招标采购组**
     - **招标秘书**
   - **管理员功能**：
     - 管理用户角色（如投标人、采购组）。
     - 创建和删除用户。
     - 更新用户信息（如邮箱、电话号码、密码和角色）。
     - 查看和管理投标人详情。
     - 查看和管理招标记录。
   - **投标人功能**：
     - 查看并在活跃的招标上提交投标。
     - 查看自己的投标。
     - 在提交投标前更新公司信息。

### 2. **招标创建和管理**
   - **招标创建**：授权用户可以创建新招标，指定：
     - 发布日期
     - 截止日期
     - 联系信息
     - 相关文件
   - **招标管理**：
     - 查看和编辑招标。
     - 通过定时任务（Node.js）自动更新招标状态。
     - 为每个招标上传相关文件。
     - 跟踪每个文件的上传者及其上传时间。
     - 为每个招标指定目标用户和采购组成员。
     - 在招标关闭后禁止编辑。

### 3. **投标管理**
   - **投标提交**：投标人可以在开放的招标上提交投标。
   - **投标查看**：招标采购组可以集体同意在招标结束后查看投标。
   - **投标评估**：招标关闭后，授权用户可以评估投标并选择中标投标。
   - **投标通知**：通过电子邮件通知中标投标人。

### 4. **投标人管理**
   - **投标人数据库**：维护一个投标人列表，允许管理员和秘书进行管理。
   - **投标人创建**：秘书可以创建投标人，并自动生成密码。
   - **投标人详情**：存储法定代表人、企业类型等详情。

### 5. **收件箱与通信**
   - **收件箱系统**：用户收到与招标相关的消息。他们可以：
     - 标记邮件为已读/未读
     - 删除邮件
     - 批量选择邮件
   - **邮件通知**：投标人中标时会收到电子邮件通知。

### 6. **聊天系统**
   - **招标专用聊天**：每个招标页面集成了一个聊天系统，用户可以讨论与招标相关的问题。

### 7. **语言支持**
   - **普通话和英语**：可以轻松切换语言。
   - **本地化错误消息**：以两种语言显示错误消息和系统通知。

### 8. **安全与身份验证**
   - **登录系统**：支持电子邮件/密码和短信登录。当前使用阿里云短信服务（可根据需要更换）。
   - **会话跟踪**：跟踪登录、登出和文件下载活动。

### 9. **管理员设置**
   - **设置管理**：管理员可以配置系统设置。
   - **搜索与筛选**：管理员可以在管理界面中搜索和筛选用户。

### 10. **其他功能**
   - **文件类型限制**：在前端和后端强制执行有效的文件上传。
   - **定时任务**：自动更新招标状态（例如从开放到关闭）。定期删除验证码。
   - **前后端集成**：应用程序使用MERN栈（MongoDB，Express，React，Node.js）同时运行前端和后端。

## 如何运行

1. **本地设置**：
   - 本地安装MongoDB或连接到云实例。
   - 克隆项目代码库。
   - 在前端和后端目录中运行 `npm install` 或 `yarn install`。
   - 在前端和后端设置环境变量（例如 `.env` 文件中的 `ATLAS_URI`）。参考 `.env.example` 文件。
   - 在根文件夹运行 `npm run dev` 启动应用程序。日志将自动追加到 `frontend.log` 和 `backend.log`。

2. **云端部署**：
   - 更新生产环境变量。
   - 使用Heroku或AWS等服务托管后端，使用Netlify等服务部署前端。

---

This system is designed to streamline tender procurement management, enabling efficient and secure tender creation, bidding, and communication.

该系统旨在简化招标采购管理，使招标的创建、投标和通信更加高效和安全。
