/* All media paths are relative to index.html. Change filenames here to match your local project. */
window.MIRAGE = {
  authors: [
    {name: 'Xinzhe Wang', role: 'joint', url: 'https://hiroxzwang.github.io/', affiliations: [1, 2]},
    {name: 'Changjian Jiang', role: 'joint', url: 'https://scholar.google.com/citations?hl=en&user=V4miywEAAAAJ', affiliations: [3, 2]},
    {name: 'Kaiwen Song', url: 'https://scholar.google.com/citations?user=J7kHTIMAAAAJ&hl=en', affiliations: [4, 2]},
    {name: 'Xudong Li', affiliations: [5, 2]},
    {name: 'Kerui Ren', url: 'https://cskrren.github.io/', affiliations: [1, 2]},
    {name: 'Ran Yi', role: 'corresponding', url: 'https://yiranran.github.io/', affiliations: [1]},
    {name: 'Lizhuang Ma', role: 'corresponding', url: 'https://dmcv.sjtu.edu.cn/people/', affiliations: [1]},
    {name: 'Chunhua Shen', url: 'https://cshen.github.io/', affiliations: [6, 2]},
    {name: 'Linning Xu', url: 'https://eveneveno.github.io/lnxu/', affiliations: [7, 2]},
    {name: 'Tao Lu', url: 'https://inspirelt.github.io/', affiliations: [2]},
    {name: 'Mulin Yu', role: 'leader', url: 'https://mulinyu.github.io/', affiliations: [2]}
  ],
  authorRoles: {
    joint: {symbol: '*', label: 'denotes joint contribution'},
    corresponding: {symbol: '†', label: 'Corresponding Author'},
    leader: {symbol: '‡', label: 'Project Leader'}
  },
  affiliations: {
    1: 'Shanghai Jiao Tong University',
    2: 'Shanghai Artificial Intelligence Laboratory',
    3: 'The University of Hong Kong',
    4: 'University of Science and Technology of China',
    5: 'Fudan University',
    6: 'Zhejiang University',
    7: 'The Chinese University of Hong Kong'
  },
  links: { paper: '', code: '', dataset: '' }, // Empty paper/code entries show disabled placeholders; other empty entries are hidden.
  hero: {
    reconstruction: 'videos/mirage_grid_5x5_full_reconstruction_30s_under30MB.mp4',
    rendering: 'videos/mirage_grid_5x5_clean_30s_under30MB.mp4'
  },
  abstract: 'Accurate metric trajectories, high-fidelity Gaussian reconstruction, and a new long-horizon indoor benchmark.',
  scenes: [
    ['o1', 'Observatory 01', 'Oxford Spires'], ['o2', 'Observatory 02', 'Oxford Spires'],
    ['k2', 'Keble 02', 'Oxford Spires'], ['k3', 'Keble 03', 'Oxford Spires'], ['k4', 'Keble 04', 'Oxford Spires'],
    ['b1', 'Blenheim 01', 'Oxford Spires'], ['b2', 'Blenheim 02', 'Oxford Spires'], ['c3', 'Christ Church 03', 'Oxford Spires'],
    ['room_01', 'Room 01', 'M2DGR'], ['room_02', 'Room 02', 'M2DGR'], ['room_03', 'Room 03', 'M2DGR'],
    ['indoor_sq1', 'Indoor SQ1', 'INS'], ['indoor_sq2', 'Indoor SQ2', 'INS'], ['indoor_sq3', 'Indoor SQ3', 'INS'], ['indoor_sq4', 'Indoor SQ4', 'INS'],
    ['0904', 'Laboratory 1', 'MIRAGE benchmark'], ['260909a', 'Laboratory 2', 'MIRAGE benchmark'], ['260911a', 'Laboratory 3', 'MIRAGE benchmark'],
    ['260913_5f', 'Dining Area 1', 'MIRAGE benchmark'], ['260913_5fs', 'Dining Area 2', 'MIRAGE benchmark'], ['260919_5f2', 'Dining Area 3', 'MIRAGE benchmark'], ['260919_5fs2', 'Dining Area 4', 'MIRAGE benchmark'],
    ['260919_6f', 'Corridor 1', 'MIRAGE benchmark'], ['260919_6fs', 'Corridor 2', 'MIRAGE benchmark'], ['260913_7f', 'Office 1', 'MIRAGE benchmark']
  ].map(([id, name, dataset]) => ({id, name, dataset, video: `videos/scenes/mirage_${id}_process_render.mp4`, poster: `assets/scenes/${id}.jpg`, excerpt: ['k4', '260919_5fs2'].includes(id)}))
};
