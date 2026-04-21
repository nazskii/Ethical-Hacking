/* ═══════════════════════════════════════════
   0xKNOWLEDGE — Ethical Hacking Repository
   script.js — Shared JavaScript
═══════════════════════════════════════════ */

/* ─────────────────────────────────────────
   NAV: Highlight active page link
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === current) a.classList.add('active');
  });

  // Init page-specific features
  if (typeof initTypewriter === 'function') initTypewriter();
  if (typeof initQuiz      === 'function') initQuiz();
  if (typeof initTerminal  === 'function') initTerminal();
  if (typeof initNmapBuilder  === 'function') initNmapBuilder();
  if (typeof initHydraBuilder === 'function') initHydraBuilder();
});

/* ─────────────────────────────────────────
   TYPEWRITER (index.html)
───────────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;
  const text = 'ethical_hacking.exe → Authorization is the only line between a penetration tester and a criminal. Same tools. Same techniques. Different permission. This repository documents the tools, concepts, and ethics of authorized security testing.';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent = text.slice(0, ++i);
      setTimeout(type, i < 30 ? 60 : 28);
    }
  }
  type();
}

/* ─────────────────────────────────────────
   FAKE TERMINAL (cli.html)
───────────────────────────────────────── */
function initTerminal() {
  const output = document.getElementById('term-output');
  const input  = document.getElementById('term-input');
  if (!output || !input) return;

  const commands = {
    'help': () => `<span class="t-out">Available: ls, pwd, whoami, ifconfig, uname, ps, history, nmap, ssh, cat /etc/passwd, clear</span>`,
    'ls':   () => `<span class="t-out">Desktop  Documents  Downloads  tools  wordlists  reports  .ssh</span>`,
    'pwd':  () => `<span class="t-out">/home/kali</span>`,
    'whoami': () => `<span class="t-out">kali</span>`,
    'ifconfig': () => `<span class="t-out">eth0: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
      inet 192.168.1.42  netmask 255.255.255.0  broadcast 192.168.1.255
      ether 08:00:27:ab:cd:ef
lo:   flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 65536
      inet 127.0.0.1  netmask 255.0.0.0</span>`,
    'uname': () => `<span class="t-out">Linux kali 6.1.0-kali9-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.27-1kali1 x86_64 GNU/Linux</span>`,
    'ps': () => `<span class="t-out">PID   TTY      TIME     CMD
  1    pts/0    00:00:00 bash
 42    pts/0    00:00:00 ps</span>`,
    'history': () => `<span class="t-out">  1  nmap -sV 192.168.1.0/24
  2  ssh student@192.168.1.100
  3  hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.50
  4  wireshark &amp;
  5  cat /etc/passwd</span>`,
    'nmap': () => `<span class="t-out">Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for 192.168.1.100
PORT     STATE  SERVICE  VERSION
22/tcp   open   ssh      OpenSSH 7.9p1
80/tcp   open   http     Apache httpd 2.4.38
3306/tcp open   mysql    MySQL 5.7.36
Nmap done: 1 IP address (1 host up) scanned in 3.42 seconds</span>`,
    'ssh': () => `<span class="t-out">usage: ssh [-l login_name] [-p port] destination
Try: ssh student@192.168.1.100</span>`,
    'ssh student@192.168.1.100': () => `<span class="t-out">The authenticity of host '192.168.1.100' can't be established.
ED25519 key fingerprint is SHA256:k3yFiNgErPr1nT...
Are you sure you want to continue? (yes/no) yes
student@192.168.1.100's password:
Linux raspberrypi 5.15.0 armv7l GNU/Linux
student@raspberrypi:~$</span>`,
    'cat /etc/passwd': () => `<span class="t-out">root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
student:x:1001:1001::/home/student:/bin/bash
admin:x:1002:1002::/home/admin:/bin/bash</span>`,
    'clear': () => { output.innerHTML = ''; return null; },
  };

  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const cmd = input.value.trim().toLowerCase();
    input.value = '';
    const promptHtml = `<div><span class="prompt">kali@pentest:~$ </span>${esc(cmd)}</div>`;
    const handler = commands[cmd];
    let result;
    if (handler) {
      result = handler();
    } else if (cmd === '') {
      result = null;
    } else {
      result = `<span class="t-err">bash: ${esc(cmd)}: command not found. Type 'help' for a list.</span>`;
    }
    if (result !== null) {
      output.innerHTML += promptHtml + `<div>${result}</div>`;
      output.scrollTop = output.scrollHeight;
    }
  });
}

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ─────────────────────────────────────────
   NMAP COMMAND BUILDER (nmap.html)
───────────────────────────────────────── */
function initNmapBuilder() {
  const wrap = document.getElementById('nmap-builder');
  if (!wrap) return;

  wrap.innerHTML = `
    <h3>// NMAP COMMAND BUILDER</h3>
    <p style="font-size:0.85rem;color:var(--text-dim);margin-bottom:1.2rem">Select options to build and explain an Nmap command in real time.</p>
    <div class="builder-row">
      <label><input type="checkbox" id="nmap-sV"> <span class="explain-flag">-sV</span> Version detection</label>
      <label><input type="checkbox" id="nmap-sS"> <span class="explain-flag">-sS</span> SYN scan (stealth)</label>
      <label><input type="checkbox" id="nmap-O">  <span class="explain-flag">-O</span>  OS detection</label>
      <label><input type="checkbox" id="nmap-A">  <span class="explain-flag">-A</span>  Aggressive scan</label>
      <label><input type="checkbox" id="nmap-p">  <span class="explain-flag">-p</span>  Specific ports:</label>
      <input class="builder-input" id="nmap-ports" placeholder="22,80,443" style="width:130px"/>
    </div>
    <div class="builder-row">
      <span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-dim)">Target IP / Range:</span>
      <input class="builder-input" id="nmap-target" value="192.168.1.0/24" style="width:200px"/>
    </div>
    <div class="builder-output" id="nmap-output"></div>
    <div class="builder-explain" id="nmap-explain"></div>
  `;

  ['nmap-sV','nmap-sS','nmap-O','nmap-A','nmap-p','nmap-ports','nmap-target'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.addEventListener('input', updateNmap); el.addEventListener('change', updateNmap); }
  });
  updateNmap();
}

function updateNmap() {
  const get = id => document.getElementById(id);
  const sV   = get('nmap-sV')?.checked;
  const sS   = get('nmap-sS')?.checked;
  const O    = get('nmap-O')?.checked;
  const A    = get('nmap-A')?.checked;
  const useP = get('nmap-p')?.checked;
  const ports  = get('nmap-ports')?.value || '22,80,443';
  const target = get('nmap-target')?.value || '192.168.1.0/24';

  const flags = [], explains = [];
  if (sS) { flags.push('-sS'); explains.push('<span class="explain-flag">-sS</span>: SYN scan — sends a SYN packet without completing the TCP handshake. Stealthy and fast.'); }
  if (sV) { flags.push('-sV'); explains.push('<span class="explain-flag">-sV</span>: Version detection — probes open ports to identify exact software and version numbers.'); }
  if (O)  { flags.push('-O');  explains.push('<span class="explain-flag">-O</span>: OS detection — analyzes response patterns to guess the target\'s operating system.'); }
  if (A)  { flags.push('-A');  explains.push('<span class="explain-flag">-A</span>: Aggressive — enables OS detection, version detection, script scanning, and traceroute.'); }
  if (useP) { flags.push(`-p ${ports}`); explains.push(`<span class="explain-flag">-p ${ports}</span>: Only scan these specific ports instead of all 65535.`); }

  const cmd = `nmap ${flags.join(' ')} ${target}`.replace(/  +/g,' ');
  get('nmap-output').textContent = cmd;
  get('nmap-explain').innerHTML  = explains.length
    ? explains.join('<br>')
    : '<span style="color:var(--text-dim)">Select flags above to see explanations.</span>';
}

/* ─────────────────────────────────────────
   HYDRA COMMAND BUILDER (bruteforce.html)
───────────────────────────────────────── */
function initHydraBuilder() {
  const wrap = document.getElementById('hydra-builder');
  if (!wrap) return;

  wrap.innerHTML = `
    <h3>// HYDRA COMMAND BUILDER</h3>
    <p style="font-size:0.85rem;color:var(--text-dim);margin-bottom:1.2rem">Build a Hydra command and understand what each flag does.</p>
    <div class="builder-row">
      <span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-dim)">Protocol:</span>
      <select id="hy-proto">
        <option>ssh</option><option>ftp</option><option>http-post-form</option><option>rdp</option>
      </select>
      <span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-dim)">Target IP:</span>
      <input class="builder-input" id="hy-ip" value="192.168.1.50" style="width:160px"/>
    </div>
    <div class="builder-row">
      <label><input type="radio" name="hy-user" id="hy-single" checked> Single user:</label>
      <input class="builder-input" id="hy-username" value="admin" style="width:120px"/>
      <label><input type="radio" name="hy-user" id="hy-list"> User list:</label>
      <input class="builder-input" id="hy-userfile" value="/usr/share/wordlists/users.txt" style="width:220px"/>
    </div>
    <div class="builder-row">
      <label><input type="checkbox" id="hy-v"> <span class="explain-flag">-v</span> Verbose output</label>
      <label><input type="checkbox" id="hy-t"> <span class="explain-flag">-t</span> Threads:</label>
      <input class="builder-input" id="hy-threads" value="4" style="width:60px"/>
    </div>
    <div class="builder-output" id="hy-output"></div>
    <div class="builder-explain" id="hy-explain"></div>
  `;

  ['hy-proto','hy-ip','hy-single','hy-list','hy-username','hy-userfile','hy-v','hy-t','hy-threads'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.addEventListener('input', updateHydra); el.addEventListener('change', updateHydra); }
  });
  updateHydra();
}

function updateHydra() {
  const get = id => document.getElementById(id);
  const proto    = get('hy-proto')?.value    || 'ssh';
  const ip       = get('hy-ip')?.value       || '192.168.1.50';
  const single   = get('hy-single')?.checked;
  const username = get('hy-username')?.value || 'admin';
  const userfile = get('hy-userfile')?.value || '/usr/share/wordlists/users.txt';
  const v      = get('hy-v')?.checked;
  const useT   = get('hy-t')?.checked;
  const threads = get('hy-threads')?.value || '4';

  const userFlag      = single ? `-l ${username}` : `-L ${userfile}`;
  const userFlagLabel = single ? '-l' : '-L';
  const userFlagVal   = single ? username : userfile;

  const flags = [userFlag, '-P /usr/share/wordlists/rockyou.txt'];
  const explains = [
    `<span class="explain-flag">${userFlagLabel} ${userFlagVal}</span>: ${single ? 'Single username to test (lowercase -l).' : 'File containing a list of usernames to try (uppercase -L).'}`,
    `<span class="explain-flag">-P rockyou.txt</span>: Uppercase -P specifies a file of passwords to try — in this case the famous rockyou.txt wordlist.`
  ];
  if (useT) { flags.splice(2, 0, `-t ${threads}`); explains.push(`<span class="explain-flag">-t ${threads}</span>: Number of parallel threads. Higher = faster, but more likely to trigger detection or lockout.`); }
  if (v)    { flags.push('-v'); explains.push('<span class="explain-flag">-v</span>: Verbose — prints each attempt to screen in real time.'); }

  get('hy-output').textContent = `hydra ${flags.join(' ')} ${proto}://${ip}`;
  get('hy-explain').innerHTML  = explains.join('<br>');
}

/* ─────────────────────────────────────────
   QUIZ (index.html)
───────────────────────────────────────── */
const quizData = [
  {
    q: "What is the single most important difference between ethical hacking and illegal hacking?",
    opts: ["The tools used are different","The hacker has written authorization","The attacker is less skilled","Ethical hackers only look, never touch"],
    correct: 1,
    exp: "Correct. Same tools, same methods — written authorization is the only legal and ethical distinction."
  },
  {
    q: "What does the Nmap flag -sV do?",
    opts: ["Scans all 65535 ports","Detects operating systems","Identifies service versions on open ports","Runs a stealth SYN scan"],
    correct: 2,
    exp: "Correct. -sV probes open ports to identify the exact software and version running on each."
  },
  {
    q: "What is the difference between a brute-force attack and a dictionary attack?",
    opts: [
      "Brute-force uses wordlists; dictionary tries every combination",
      "They are identical — just different names",
      "Brute-force tries every possible combination; dictionary attack uses a known wordlist",
      "Dictionary attacks only work on web forms"
    ],
    correct: 2,
    exp: "Correct. Brute-force is exhaustive (all combinations). Dictionary attacks use curated wordlists — faster in practice."
  },
  {
    q: "What could Wireshark reveal if a user logs into a site over plain HTTP?",
    opts: [
      "Nothing — all traffic is encrypted",
      "Only the URL visited, not credentials",
      "The username and password in plain text inside the captured packet",
      "The server's SSL certificate"
    ],
    correct: 2,
    exp: "Correct. HTTP does not encrypt traffic. Login form data is visible in plain text inside the packet payload."
  },
  {
    q: "Which defense MOST effectively stops a Hydra attack even if the password is guessed correctly?",
    opts: ["Strong firewall rules","Account lockout after 5 attempts","Multi-Factor Authentication (MFA)","Moving SSH to port 2222"],
    correct: 2,
    exp: "Correct. MFA means a correct password alone is insufficient — a second factor is still required to log in."
  },
  {
    q: "What made Telnet insecure compared to SSH?",
    opts: [
      "Telnet used weaker encryption than SSH",
      "Telnet transmitted all data — including passwords — as unencrypted plain text",
      "Telnet was slower",
      "Telnet required root access to run"
    ],
    correct: 1,
    exp: "Correct. Telnet sent everything in plain text. SSH replaced it with an encrypted, authenticated session."
  },
];

let qIndex = 0, qScore = 0, qAnswered = false;

function initQuiz() {
  renderQuiz();
}

function renderQuiz() {
  const c = document.getElementById('quiz-container');
  if (!c) return;

  if (qIndex >= quizData.length) {
    c.innerHTML = `
      <div class="quiz-score">SCORE: ${qScore} / ${quizData.length}</div>
      <p style="text-align:center;margin-top:1rem;color:var(--text-dim);font-family:var(--font-mono)">
        ${qScore === quizData.length
          ? '// PERFECT — All correct. You are cleared for deployment.'
          : qScore >= 4
            ? '// SOLID — Minor gaps. Review missed questions.'
            : '// REVIEW NEEDED — Revisit the tool pages before submitting.'}
      </p>
      <div style="text-align:center">
        <button class="btn" onclick="resetQuiz()">// RESTART QUIZ</button>
      </div>`;
    return;
  }

  const q = quizData[qIndex];
  c.innerHTML = `
    <div class="quiz-progress">QUESTION ${qIndex + 1} OF ${quizData.length} &nbsp;|&nbsp; SCORE: ${qScore}</div>
    <div class="quiz-q" style="margin-top:1rem">${q.q}</div>
    <div class="quiz-options">
      ${q.opts.map((o, i) => `<button class="quiz-opt" onclick="answerQuiz(${i})">${o}</button>`).join('')}
    </div>
    <div class="quiz-feedback" id="quiz-fb"></div>
    <button class="btn" id="quiz-next" style="display:none" onclick="nextQuestion()">// NEXT QUESTION →</button>`;
  qAnswered = false;
}

function answerQuiz(idx) {
  if (qAnswered) return;
  qAnswered = true;
  const q = quizData[qIndex];
  const opts = document.querySelectorAll('.quiz-opt');
  opts[idx].classList.add(idx === q.correct ? 'correct' : 'wrong');
  if (idx !== q.correct) opts[q.correct].classList.add('correct');
  if (idx === q.correct) qScore++;
  document.getElementById('quiz-fb').innerHTML =
    `<span style="color:${idx === q.correct ? 'var(--green)' : '#ff6666'}">${idx === q.correct ? '✓ ' : '✗ '}${q.exp}</span>`;
  document.getElementById('quiz-next').style.display = 'inline-block';
}

function nextQuestion() { qIndex++; renderQuiz(); }
function resetQuiz()    { qIndex = 0; qScore = 0; renderQuiz(); }
