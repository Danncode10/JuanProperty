# Supabase Email Auth Setup

Use this guide to configure JuanProperty email confirmation and password-reset
links against the hosted Supabase project.

**Target project:** `JuanProperty` (`bnhylarpwbdwdrpctibn`)

Email/password authentication remains enabled. JuanProperty requires new
email/password accounts to confirm their address before sign-in.

## 1. Allow Local Redirect URLs

In the Supabase Dashboard, open **Authentication > URL Configuration**.

Set the local development **Site URL** to:

```text
http://localhost:3000
```

Add both URLs under **Redirect URLs**:

```text
http://localhost:3000/auth/callback
http://localhost:3000/reset-password
```

Save the changes. Supabase only redirects to URLs in this allow list.

Do not add production URLs until `[P0.7]` establishes the canonical HTTPS
origin. At launch, change the Site URL to that origin and retain localhost only
when local testing is still required.

## 2. Configure Gmail SMTP

In the Supabase Dashboard, open **Authentication > Emails > SMTP Settings** and
enable **Custom SMTP**.

| Setting      | Value                                                            |
| ------------ | ---------------------------------------------------------------- |
| Host         | `smtp.gmail.com`                                                 |
| Port         | `465`                                                            |
| Username     | The Gmail sender address                                         |
| Password     | A Google App Password created after enabling 2-Step Verification |
| Sender email | The same Gmail address used as the username                      |
| Sender name  | `JuanProperty`                                                   |

Enter the App Password directly in Supabase. Never print it, store it in
`.env.local`, or commit it. The sender address must belong to the configured
Gmail account. Standard Gmail accounts are limited to approximately 500 sent
messages per day, so use this setup for development and early-stage volume.

## 3. Install the Email Templates

Open **Authentication > Emails > Templates**.

| Supabase template | Subject                            | Repository file                                                |
| ----------------- | ---------------------------------- | -------------------------------------------------------------- |
| Confirm sign up   | `Confirm your JuanProperty email`  | [`confirm-signup.html`](./email-templates/confirm-signup.html) |
| Reset password    | `Reset your JuanProperty password` | [`reset-password.html`](./email-templates/reset-password.html) |

For each template, replace the email body with the contents of its repository
file and save.

Keep this exact placeholder in the button link:

```html
{{ .ConfirmationURL }}
```

Do not replace it with a localhost URL or a deployed URL. Supabase generates
the signed, single-use URL and then redirects the user to an allowed app URL.

## 4. Verify

1. Create a fresh account using a new email address.
2. Open the newest **Confirm your email** message.
3. Confirm the browser returns to `http://localhost:3000/login` without an error.
4. From login, select **Forgot password**, request a reset link, and confirm the browser opens `http://localhost:3000/reset-password`.

Also verify that an unconfirmed account cannot sign in and that both messages
display JuanProperty branding. Production-domain testing remains deferred to
`[P0.7]`.

Email links are single-use. Request a new email after changing the URL settings
or templates; an old link cannot test the new configuration.
