window.CATALOG = [
  {
    "name": "Mandate",
    "repo": "https://github.com/tomiin/midnight-mandate",
    "demo": "https://tomiin.github.io/midnight-mandate/",
    "video": "https://youtu.be/tt_2N3Ekv6U",
    "network": "preprod",
    "contract": "49ef1c9bec0a0e5e8ab6214184842ea15b6d68c50b6654d12e7ebedfc19d55b9",
    "tagline": "Agent proves it is authorized and within budget without revealing who it works for.",
    "result": {
      "name": "Mandate",
      "checkedAt": "2026-10-29T22:22:24.299Z",
      "commit": {
        "sha": "b7662a5502c99767a9d3462489075052430d0bde",
        "date": "2026-09-30T06:57:01Z",
        "branch": "main"
      },
      "passed": 12,
      "total": 12,
      "skipped": 0,
      "flags": [],
      "notes": [],
      "checks": [
        {
          "id": "repo.exists",
          "ok": true,
          "detail": "tomiin/midnight-mandate"
        },
        {
          "id": "repo.public",
          "ok": true,
          "detail": "public"
        },
        {
          "id": "repo.original",
          "ok": true,
          "detail": "not a fork"
        },
        {
          "id": "repo.age",
          "ok": true,
          "detail": "29 days old"
        },
        {
          "id": "repo.commits",
          "ok": true,
          "detail": "4 commits"
        },
        {
          "id": "repo.recent",
          "ok": true,
          "detail": "last commit 29 days ago"
        },
        {
          "id": "repo.readme",
          "ok": true,
          "detail": "28085 bytes"
        },
        {
          "id": "owner.age",
          "ok": true,
          "detail": "account 3004 days old"
        },
        {
          "id": "scan.secrets",
          "ok": true,
          "detail": "no secret patterns in 74 files"
        },
        {
          "id": "demo.loads",
          "ok": true,
          "detail": "HTTP 200"
        },
        {
          "id": "video.loads",
          "ok": true,
          "detail": "HTTP 200"
        },
        {
          "id": "contract.format",
          "ok": true,
          "detail": "64-hex, preprod (on-chain lookup not yet implemented)"
        }
      ]
    }
  },
  {
    "name": "NightPoll",
    "repo": "https://github.com/hycorange/nightpoll",
    "tagline": "Anonymous community polls on Midnight. ZK membership proofs + nullifiers stop double voting; only the tally is public.",
    "result": {
      "name": "NightPoll",
      "checkedAt": "2026-10-29T22:22:27.847Z",
      "commit": {
        "sha": "1171097efc710e8aca9b285be05182dc7c61e430",
        "date": "2026-10-12T06:38:27Z",
        "branch": "main"
      },
      "passed": 9,
      "total": 9,
      "skipped": 3,
      "flags": [],
      "notes": [],
      "checks": [
        {
          "id": "repo.exists",
          "ok": true,
          "detail": "hycorange/nightpoll"
        },
        {
          "id": "repo.public",
          "ok": true,
          "detail": "public"
        },
        {
          "id": "repo.original",
          "ok": true,
          "detail": "not a fork"
        },
        {
          "id": "repo.age",
          "ok": true,
          "detail": "18 days old"
        },
        {
          "id": "repo.commits",
          "ok": true,
          "detail": "6 commits"
        },
        {
          "id": "repo.recent",
          "ok": true,
          "detail": "last commit 17 days ago"
        },
        {
          "id": "repo.readme",
          "ok": true,
          "detail": "23137 bytes"
        },
        {
          "id": "owner.age",
          "ok": true,
          "detail": "account 2749 days old"
        },
        {
          "id": "scan.secrets",
          "ok": true,
          "detail": "no secret patterns in 35 files"
        },
        {
          "id": "demo.loads",
          "ok": null,
          "detail": "not provided (optional)"
        },
        {
          "id": "video.loads",
          "ok": null,
          "detail": "not provided (optional)"
        },
        {
          "id": "contract.format",
          "ok": null,
          "detail": "not provided (optional)"
        }
      ]
    }
  },
  {
    "name": "Attesta",
    "repo": "https://github.com/zzaved/Attesta",
    "tagline": "A living registry of reusable compliance attestations: confirm a partner's compliance check is still valid without receiving the document.",
    "result": {
      "name": "Attesta",
      "checkedAt": "2026-10-29T22:22:36.656Z",
      "commit": {
        "sha": "c81c242199d6632e42bdc9b0cdcaaf22732da720",
        "date": "2026-09-16T14:37:36Z",
        "branch": "main"
      },
      "passed": 9,
      "total": 9,
      "skipped": 3,
      "flags": [],
      "notes": [
        {
          "id": "scan.env-file",
          "detail": "env or key-style file committed (often public config; contents were checked for key patterns separately): sensitive-file-committed at bboard-ui/.env.preprod:1; sensitive-file-committed at bboard-ui/.env.preview:1"
        }
      ],
      "checks": [
        {
          "id": "repo.exists",
          "ok": true,
          "detail": "zzaved/Attesta"
        },
        {
          "id": "repo.public",
          "ok": true,
          "detail": "public"
        },
        {
          "id": "repo.original",
          "ok": true,
          "detail": "not a fork"
        },
        {
          "id": "repo.age",
          "ok": true,
          "detail": "68 days old"
        },
        {
          "id": "repo.commits",
          "ok": true,
          "detail": "46 commits"
        },
        {
          "id": "repo.recent",
          "ok": true,
          "detail": "last commit 43 days ago"
        },
        {
          "id": "repo.readme",
          "ok": true,
          "detail": "38921 bytes"
        },
        {
          "id": "owner.age",
          "ok": true,
          "detail": "account 998 days old"
        },
        {
          "id": "scan.secrets",
          "ok": true,
          "detail": "no secret patterns in 121 files"
        },
        {
          "id": "demo.loads",
          "ok": null,
          "detail": "not provided (optional)"
        },
        {
          "id": "video.loads",
          "ok": null,
          "detail": "not provided (optional)"
        },
        {
          "id": "contract.format",
          "ok": null,
          "detail": "not provided (optional)"
        }
      ]
    }
  },
  {
    "name": "tell",
    "repo": "https://github.com/RohanGlitched/tell",
    "tagline": "Privacy leak scanner for Midnight: shows, in bits, what each Compact circuit gives away.",
    "result": {
      "name": "tell",
      "checkedAt": "2026-10-29T22:22:49.918Z",
      "commit": {
        "sha": "bb14bb4d1ce801c14521e2c01a93a85ca38cefbd",
        "date": "2026-10-12T04:20:30Z",
        "branch": "main"
      },
      "passed": 9,
      "total": 9,
      "skipped": 3,
      "flags": [],
      "notes": [],
      "checks": [
        {
          "id": "repo.exists",
          "ok": true,
          "detail": "RohanGlitched/tell"
        },
        {
          "id": "repo.public",
          "ok": true,
          "detail": "public"
        },
        {
          "id": "repo.original",
          "ok": true,
          "detail": "not a fork"
        },
        {
          "id": "repo.age",
          "ok": true,
          "detail": "18 days old"
        },
        {
          "id": "repo.commits",
          "ok": true,
          "detail": "11 commits"
        },
        {
          "id": "repo.recent",
          "ok": true,
          "detail": "last commit 17 days ago"
        },
        {
          "id": "repo.readme",
          "ok": true,
          "detail": "10154 bytes"
        },
        {
          "id": "owner.age",
          "ok": true,
          "detail": "account 1183 days old"
        },
        {
          "id": "scan.secrets",
          "ok": true,
          "detail": "no secret patterns in 189 files"
        },
        {
          "id": "demo.loads",
          "ok": null,
          "detail": "not provided (optional)"
        },
        {
          "id": "video.loads",
          "ok": null,
          "detail": "not provided (optional)"
        },
        {
          "id": "contract.format",
          "ok": null,
          "detail": "not provided (optional)"
        }
      ]
    }
  },
  {
    "name": "TrueReport",
    "repo": "https://github.com/Yonkoo11/truereport",
    "tagline": "Medical reports with a QR anyone can check against a Midnight registry, without exposing the diagnosis.",
    "result": {
      "name": "TrueReport",
      "checkedAt": "2026-10-29T22:22:54.399Z",
      "commit": {
        "sha": "2f11b26f50de968251493f6dc47e3bf11797012b",
        "date": "2026-10-18T16:34:21Z",
        "branch": "master"
      },
      "passed": 9,
      "total": 9,
      "skipped": 3,
      "flags": [],
      "notes": [],
      "checks": [
        {
          "id": "repo.exists",
          "ok": true,
          "detail": "Yonkoo11/truereport"
        },
        {
          "id": "repo.public",
          "ok": true,
          "detail": "public"
        },
        {
          "id": "repo.original",
          "ok": true,
          "detail": "not a fork"
        },
        {
          "id": "repo.age",
          "ok": true,
          "detail": "11 days old"
        },
        {
          "id": "repo.commits",
          "ok": true,
          "detail": "23 commits"
        },
        {
          "id": "repo.recent",
          "ok": true,
          "detail": "last commit 11 days ago"
        },
        {
          "id": "repo.readme",
          "ok": true,
          "detail": "9758 bytes"
        },
        {
          "id": "owner.age",
          "ok": true,
          "detail": "account 1876 days old"
        },
        {
          "id": "scan.secrets",
          "ok": true,
          "detail": "no secret patterns in 51 files"
        },
        {
          "id": "demo.loads",
          "ok": null,
          "detail": "not provided (optional)"
        },
        {
          "id": "video.loads",
          "ok": null,
          "detail": "not provided (optional)"
        },
        {
          "id": "contract.format",
          "ok": null,
          "detail": "not provided (optional)"
        }
      ]
    }
  },
  {
    "name": "Private Health-Factor Proof",
    "repo": "https://github.com/harshkas4na/midnight-health-factor-proof",
    "tagline": "Private health-factor proof on Midnight (Compact), Wave 1.",
    "result": {
      "name": "Private Health-Factor Proof",
      "checkedAt": "2026-10-29T22:22:58.473Z",
      "commit": {
        "sha": "cada2da4b42f4a818f45c3592f16997fe2a39a4c",
        "date": "2026-09-07T04:34:34Z",
        "branch": "master"
      },
      "passed": 9,
      "total": 9,
      "skipped": 3,
      "flags": [],
      "notes": [],
      "checks": [
        {
          "id": "repo.exists",
          "ok": true,
          "detail": "harshkas4na/midnight-health-factor-proof"
        },
        {
          "id": "repo.public",
          "ok": true,
          "detail": "public"
        },
        {
          "id": "repo.original",
          "ok": true,
          "detail": "not a fork"
        },
        {
          "id": "repo.age",
          "ok": true,
          "detail": "77 days old"
        },
        {
          "id": "repo.commits",
          "ok": true,
          "detail": "13 commits"
        },
        {
          "id": "repo.recent",
          "ok": true,
          "detail": "last commit 52 days ago"
        },
        {
          "id": "repo.readme",
          "ok": true,
          "detail": "13183 bytes"
        },
        {
          "id": "owner.age",
          "ok": true,
          "detail": "account 1392 days old"
        },
        {
          "id": "scan.secrets",
          "ok": true,
          "detail": "no secret patterns in 48 files"
        },
        {
          "id": "demo.loads",
          "ok": null,
          "detail": "not provided (optional)"
        },
        {
          "id": "video.loads",
          "ok": null,
          "detail": "not provided (optional)"
        },
        {
          "id": "contract.format",
          "ok": null,
          "detail": "not provided (optional)"
        }
      ]
    }
  }
];
