import { BlogPost } from './types';

export const ALL_POSTS: BlogPost[] = [
  // ── LINUX ────────────────────────────────────────────────────────────────
  {
    id: 'post-1',
    slug: 'linux-essential-commands-for-developers',
    title: 'Linux Essential Commands Every Developer Should Know',
    excerpt:
      'A curated reference of the most useful terminal commands I use daily — from file management to process control and network debugging.',
    content: `## Why Terminal Mastery Matters

When I made the switch to Linux as my primary dev OS, the terminal went from a scary black box to my best friend. Here are the commands I reach for every single day.

## File & Directory Navigation

\`\`\`bash
ls -la          # List all files including hidden, with details
cd -            # Jump to previous directory
pwd             # Print working directory
find . -name "*.ts" -type f   # Find all TypeScript files
\`\`\`

## Process Management

\`\`\`bash
htop            # Interactive process viewer (install if missing)
ps aux | grep node    # Find node processes
kill -9 <PID>   # Force kill a process
lsof -i :3000   # What's running on port 3000?
\`\`\`

## Networking

\`\`\`bash
curl -I https://example.com   # Fetch HTTP headers
netstat -tulpn                # List open ports
ss -tulwn                     # Modern alternative to netstat
\`\`\`

## Git Shortcuts I Actually Use

\`\`\`bash
git log --oneline --graph --decorate -20
git stash push -m "WIP: feature name"
git diff --staged
\`\`\`

Keep this as a bookmark — I'll keep updating it as I find new gems.`,
    category: 'linux',
    tags: ['terminal', 'bash', 'productivity'],
    author: 'Geric Morit',
    publishedAt: 'Jun 20, 2026',
    readTimeMinutes: 5,
    coverImageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
    comments: [
      {
        id: 'c-1',
        author: 'devfriend',
        content: 'Great list! I\'d add `watch` for monitoring repeated commands in real time.',
        createdAt: 'Jun 21, 2026',
        replies: [],
      },
    ],
  },
  {
    id: 'post-2',
    slug: 'setting-up-zsh-and-oh-my-zsh',
    title: 'Setting Up Zsh + Oh My Zsh for a Productive Dev Environment',
    excerpt:
      'My personal step-by-step guide to turning a vanilla Ubuntu shell into a supercharged, beautiful terminal with autocompletion and themes.',
    content: `## From Bash to Zsh

The first thing I do on every fresh Linux install is swap bash for zsh. Here's my exact setup.

## Install Zsh

\`\`\`bash
sudo apt update && sudo apt install zsh -y
chsh -s $(which zsh)
\`\`\`

Log out and back in — you're now on zsh.

## Install Oh My Zsh

\`\`\`bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
\`\`\`

## My Recommended Plugins

In \`~/.zshrc\`:

\`\`\`bash
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
  docker
  node
)
\`\`\`

## Theme: Powerlevel10k

\`\`\`bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git \\
  ${'${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}'}/themes/powerlevel10k
\`\`\`

Set \`ZSH_THEME="powerlevel10k/powerlevel10k"\` in \`.zshrc\` and run \`p10k configure\`.

Instant 10x terminal vibes. ✨`,
    category: 'linux',
    tags: ['zsh', 'terminal', 'setup'],
    author: 'Geric Morit',
    publishedAt: 'Jun 15, 2026',
    readTimeMinutes: 7,
    comments: [],
  },

  // ── WINDOWS ──────────────────────────────────────────────────────────────
  {
    id: 'post-3',
    slug: 'windows-wsl2-developer-setup',
    title: 'WSL2: Running Linux Inside Windows Like a Pro',
    excerpt:
      'How I set up WSL2 with Ubuntu on Windows 11 to get the best of both worlds — Windows apps and a full Linux dev environment.',
    content: `## Why WSL2?

I switch between Linux and Windows machines a lot. WSL2 lets me keep my Linux workflow alive on Windows without dual-booting.

## Enable WSL2

Open PowerShell as Administrator:

\`\`\`powershell
wsl --install
wsl --set-default-version 2
\`\`\`

Restart. Then install Ubuntu from the Microsoft Store.

## Configure VS Code Integration

Install the **WSL** extension in VS Code. Then from your WSL terminal:

\`\`\`bash
code .    # Opens the folder in VS Code via WSL bridge
\`\`\`

## Performance Tips

- Store your projects inside WSL filesystem (\`~/projects\`), NOT in \`/mnt/c/...\`
- Use Windows Terminal for a better multi-tab experience
- Enable \`.wslconfig\` memory limits:

\`\`\`ini
[wsl2]
memory=8GB
processors=4
\`\`\`

Place this in \`C:\\Users\\<YourUser>\\.wslconfig\`.`,
    category: 'windows',
    tags: ['wsl2', 'windows', 'setup'],
    author: 'Geric Morit',
    publishedAt: 'Jun 10, 2026',
    readTimeMinutes: 6,
    coverImageUrl: 'https://images.unsplash.com/photo-1640552435388-a54879e72b28?auto=format&fit=crop&w=800&q=80',
    comments: [],
  },
  {
    id: 'post-4',
    slug: 'windows-terminal-setup-guide',
    title: 'Windows Terminal: The Ultimate Setup Guide',
    excerpt:
      'Transforming Windows Terminal from a plain CMD replacement into a gorgeous, productive shell with custom profiles and themes.',
    content: `## Install Windows Terminal

Grab it from the Microsoft Store or via winget:

\`\`\`powershell
winget install Microsoft.WindowsTerminal
\`\`\`

## Set WSL as Default Profile

Open settings (\`Ctrl+,\`) → Startup → Default Profile → select your Ubuntu WSL.

## Custom Theme

I use the **One Half Dark** or **Tokyo Night** themes. Add to your \`settings.json\`:

\`\`\`json
{
  "schemes": [{
    "name": "Tokyo Night",
    "background": "#1a1b26",
    "foreground": "#a9b1d6",
    "cursorColor": "#c0caf5"
  }]
}
\`\`\`

## Keyboard Shortcuts to Learn

| Action | Shortcut |
|--------|----------|
| New tab | Ctrl+Shift+T |
| Split pane | Alt+Shift+D |
| Focus pane | Alt+Arrow |
| Close tab | Ctrl+Shift+W |

The split pane feature alone is worth installing this over CMD.`,
    category: 'windows',
    tags: ['terminal', 'windows', 'productivity'],
    author: 'Geric Morit',
    publishedAt: 'Jun 5, 2026',
    readTimeMinutes: 4,
    comments: [],
  },

  // ── CODING ───────────────────────────────────────────────────────────────
  {
    id: 'post-5',
    slug: 'nextjs-app-router-patterns-i-use',
    title: 'Next.js App Router Patterns I Actually Use in Production',
    excerpt:
      'After shipping several Next.js 14+ projects with the App Router, here are the patterns that stuck — and the ones I avoid.',
    content: `## The App Router Changed Everything

When I first migrated to the App Router, I fought it. Now I can't go back. Here's what I've learned.

## 1. Server Components for Data Fetching

Stop putting everything in \`useEffect\`. Server Components can fetch directly:

\`\`\`tsx
// app/posts/page.tsx — Server Component
export default async function PostsPage() {
  const posts = await fetchPosts(); // No useEffect needed
  return <PostList posts={posts} />;
}
\`\`\`

## 2. Route Groups for Layout Isolation

Use \`(groupName)\` folders to scope layouts without affecting URLs:

\`\`\`
app/
├── (auth)/
│   ├── login/page.tsx
│   └── layout.tsx       ← Only applies to auth routes
└── (dashboard)/
    ├── home/page.tsx
    └── layout.tsx       ← Only applies to dashboard
\`\`\`

## 3. Loading UI with Suspense

\`\`\`tsx
// app/posts/loading.tsx — Automatic Suspense boundary
export default function Loading() {
  return <PostsSkeleton />;
}
\`\`\`

## Anti-patterns I've Stopped Using

- ❌ Putting API calls in Client Components when Server Components work
- ❌ Using \`useRouter().push()\` when \`<Link>\` is enough  
- ❌ Global state for data that could be URL state (\`searchParams\`)`,
    category: 'coding',
    tags: ['nextjs', 'react', 'typescript'],
    author: 'Geric Morit',
    publishedAt: 'Jun 18, 2026',
    readTimeMinutes: 8,
    coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    comments: [
      {
        id: 'c-2',
        author: 'reactfan',
        content: 'The route groups tip is underrated — saved me so many nested layout headaches!',
        createdAt: 'Jun 19, 2026',
        replies: [],
      },
    ],
  },
  {
    id: 'post-6',
    slug: 'typescript-tips-i-wish-i-knew-earlier',
    title: 'TypeScript Tips I Wish I Knew When I Started',
    excerpt:
      'The TypeScript features and patterns that leveled up my code quality — from discriminated unions to satisfies and const assertions.',
    content: `## TypeScript is a Superpower (When You Use It Right)

After years of TypeScript, here are the things I wish Day 1 me knew.

## 1. Discriminated Unions > Optional Fields

**Don't do this:**
\`\`\`ts
interface Result {
  data?: User;
  error?: string;
  loading?: boolean;
}
\`\`\`

**Do this:**
\`\`\`ts
type Result =
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; message: string };
\`\`\`

## 2. The \`satisfies\` Operator

\`\`\`ts
const theme = {
  colors: { primary: '#6366f1', secondary: '#22c55e' },
  spacing: { sm: '0.5rem', md: '1rem' },
} satisfies Record<string, Record<string, string>>;

// theme.colors.primary is still typed as string literal!
\`\`\`

## 3. Const Assertions

\`\`\`ts
const ROUTES = ['/', '/coding', '/os/linux'] as const;
type Route = typeof ROUTES[number]; // '/' | '/coding' | '/os/linux'
\`\`\`

## 4. Template Literal Types

\`\`\`ts
type EventName = \`on\${Capitalize<string>}\`;
// Valid: 'onClick', 'onChange', 'onSubmit'
\`\`\``,
    category: 'coding',
    tags: ['typescript', 'tips', 'patterns'],
    author: 'Geric Morit',
    publishedAt: 'Jun 12, 2026',
    readTimeMinutes: 6,
    comments: [],
  },
  {
    id: 'post-7',
    slug: 'my-dev-environment-2026',
    title: 'My Complete Developer Environment Setup in 2026',
    excerpt:
      'Every tool, config, and extension that powers my development workflow — from IDE setup to Git hooks and dotfiles.',
    content: `## The Stack

This is my current dev environment as of mid-2026. Updated regularly.

## Editor: VS Code

**Extensions I can't live without:**
- ESLint + Prettier
- GitLens
- Tailwind CSS IntelliSense
- GitHub Copilot
- Error Lens
- Peacock (color-coded workspaces)

**settings.json highlights:**
\`\`\`json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.fontFamily": "Fira Code",
  "editor.fontLigatures": true,
  "editor.fontSize": 14,
  "editor.lineHeight": 1.7
}
\`\`\`

## Terminal Stack

- **Shell:** Zsh + Oh My Zsh + Powerlevel10k
- **Multiplexer:** Tmux (when SSH'ing into servers)
- **CLI tools:** \`fzf\`, \`ripgrep\`, \`bat\`, \`eza\`, \`zoxide\`

## Git Config

\`\`\`bash
git config --global core.editor "code --wait"
git config --global pull.rebase true
git config --global alias.lg "log --oneline --graph --decorate"
\`\`\`

## Dotfiles

All my configs are versioned at github.com/gericandmorty/dotfiles (coming soon).`,
    category: 'general',
    tags: ['setup', 'vscode', 'tools'],
    author: 'Geric Morit',
    publishedAt: 'Jun 8, 2026',
    readTimeMinutes: 5,
    comments: [],
  },
];

export function getPostsByCategory(category: string) {
  return ALL_POSTS.filter((p) => p.category === category);
}

export function getPostBySlug(slug: string) {
  return ALL_POSTS.find((p) => p.slug === slug) ?? null;
}
