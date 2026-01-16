// ==UserScript==
// @name         MWI Calculator IIFE
// @namespace    http://github.com/wondher
// @version      2.3.5
// @license      CC-BY-NC-SA-4.0
// @description  A new type of calculator for MWI - Real-time combat analytics with DPS Meter, Loot Tracker, XP Tracker, Party Overview, and more.
// @author       Brian Mendes (Wondher)
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @icon         data:image/vnd.microsoft.icon;base64,AAABAAMAEBAAAAEAIABoBAAANgAAACAgAAABACAAKBEAAJ4EAAAwMAAAAQAgAGgmAADGFQAAKAAAABAAAAAgAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGR3j/+qtb3/v8TG/y8rK/+Tlpv/x83S/9jd3//U2tz/3eLk/93j5P/Z4OL/wcvS/0Vvnf85Q13/Q2t2/1KElP+hp6v/y9DR/+fr7P+tr7D/wMTI/9PZ2//f5OX/4ebn/+Tp6v/h5uf/4OXm/8/X2/9AWnf/K2Zz/zlhbf9HjZ3/ycvN/+bq6v/z9vb/5enq/93i4v/j5+f/5enq/+vw8P/Dxcb/3ODi/+Po6f/a4OL/bG2E/z9MVv9HcH//QY+e/3ZycP/m6On/8/b2//T39v/o7Oz/6+/v/+zw8P/x9fT/mpma/4aFiP+nqKr/ys/R/3FkbP9LR0//R2Jt/1eGlP8pIyD/ycnJ//Hz8//5+vn/9Pf3//D08//x9fT/6+7u/6upqf+Qjo//oKCh/4WDg/+MjZL/bWNn/xgWFf8cIyb/FRAN/4mHhv/t7u7/+fr5//z9+//3+fn/9fj4//T39//x9fT/5+vq/8HCwP+9v7//cnFy/0A2N/8MCgf/QE5W/w8KB/8bFhP/ycjH//Lz8v/4+fj/9Pb2//X39v/19/f/8/X1//H09P/t8fD/5uvq/2hnZP8nIyL/Lyso/x4kMv8LBgP/Ew4M/2xtb/+VkZH/0NDP/+zu7v/y9PP/6e/1/6/H5v+iut7/5+np/+Dj4/9vamf/QkBA/zEyMv8tLS3/CQQB/xQQDf9pam3/SkNG/ysrMv9XXmv/nqi5/3GQv/9ylcb/hZu+/5+dnP+LiIb/fn16/3l4eP9wcnP/UlNT/wsHBP8gHR3/bG1w/19cYP8sPlP/FS5K/z1Rdf9khbv/d5PR/3eYyP+HhYX/h4SC/3R1dv9gaW7/XGNo/25xc/8OCQf/JCAf/21scf9cWl3/KDtS/xIuTv9ab57/ZYK2/2aBtv+CodL/h5Gi/356e/9cXmX/XWx1/1hnb/9mam//CgUC/y4qKv9ubHH/bmVn/yg7U/8RJUD/Qk90/1BXev9kd57/XW6a/2txh/+LiYn/fXx9/1pocP9aYWr/Y2Zq/wwHBP83NDP/b2tv/6WDcv81Qlf/EiQ7/1BsmP+FrN//nr3o/4Oq2/9XX3H/iYSF/4qFiP+BgID/fXt8/3p5eP8PCQX/OzMz/3VpaP+6k3f/poh6/4t5d/9AOj7/LjVF/z9KX/89RVj/bWlu/3VscP9/en3/eHZ4/3NxdP9wbXH/ZVRR/4dtYv+tg2D/qXhW/3JVT/9VSE3/S0RL/0I9Rf9BPEL/T0lO/1JKT/9QSEv/X1tf/01LTf9MSUv/SEVI/7mKZv+kck3/aElA/2FFQf9NPkD/RTtD/0U6Rf9GO0X/ST5I/01ESv9QRUn/TkRJ/0xFR/9KR0r/QD0//z06O/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAACAAAABAAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAClKeP9BW4D/cIOa/7fCyf/T2t3/b3F1/xcTEv8YFBP/ZWBk/7C5wP+6wsj/zNPW/9Xb3f/U293/09rc/9DX2v/W3N//3uPk/97j5f/b4eP/2ODi/9Tc3//Fz9X/tcHJ/056pf9AZ6T/VkN7/xkZKP87ZW7/WXqG/2SLmv9EdYX/iZOc/5uip/+vtrn/09jZ/+Hl5v/a4OH/cnJz/xoUFf96e4D/vMTK/7/GzP/W293/2+Dh/9vg4f/U2tz/2d7g/+Dl5v/h5uf/3+Tl/97j5P/e4+T/3OLj/8/X3P+9x87/U3eb/zNikP9Td47/IjhC/zZYYv9AdYL/UI2c/1CFlv+aoaX/oqir/7e7vf/W29v/5erq/+Po6f/M0dL/NC8y/5ucov/K0NP/w8nP/9zh4f/g5eb/3OHi/9rf4P/j5+j/5Onq/+Po6f/h5uf/4OXm/9/k5v/f5OX/1t3g/8TN0v9cdpT/KEhp/zhxgP8lWWX/NElU/0yGlf8+fIv/XZmq/5+kqv+orrL/xMnL/93i4v/p7e7/6u7u/+Dk5P/T2Nr/x8zQ/9Xa3P/O09b/4ebn/+Po6f/c4eL/4ufo/+fs7P/n7O3/4+jp/+Po6f/h5uf/4ebn/+Hm5//b4eP/ydLX/2aAnf8XKUH/IFFb/y17i/8mTFj/Pmh0/z+Lm/9BlqX/vsHF/8/T1P/Z3t7/5+zr//L29f/x9vX/6O3t/9re4P/W293/3eLi/9re4P/l6ur/5Onq/+Hm5//p7u7/6+/w/+br7P/l6uv/5Onq/+Ln6P/i5+j/4ufo/97k5f/R2dz/fpKv/zk6VP8yMTr/XIeW/0Rzg/80Wmf/PICP/zSYp/+8urv/3eDg/+js7P/v9PP/9fj4//P29v/u8/L/4+jo/93i4v/k6ej/4ubm/+ru7v/l6er/6e7u/+zx8P/s8fH/wMLD/4B+f//JzM7/4ebo/+Tp6v/k6er/4ebn/9fe4P+Um7P/Y01c/zAkKv88Ulz/WYST/0lwfv9OiZn/R5uo/0Q8OP/NzMz/5+rr/+3w8P/x9fX/9Pf3//L19f/v8/L/5Ono/+Xq6f/n7Ov/7fHw/+js7P/t8fH/8PTz//D19P+7vL3/ioeJ/6eprP+Hh4z/w8jL/+Tp6v/j6On/3OLj/42KlP9MN0D/NCkt/zs+Q/9Lbnv/ToSU/2KXp/9jnaz/FhAL/7GvsP/d39//5ujp/+/y8v/6+/r/9vj4//j7+v/s8PD/6u7u/+zw8P/r7/D/7fHx/+/z8//y9vX/8fb1/52eoP+Hg4T/hYOH/2dgYf+Ihof/bWtt/6mrrv/CyMv/m5SZ/087Qf9raHP/U0xY/zg4Pf9KXmf/VnR+/0JygP8WEAz/Y15c/9ze3//r7e7/8fPz//T29v/6+/r/+fv5//T39//v8/P/8vX1/+rv7//u8vH/8/b2//T39//P0tP/lpGR/5ybnf+ytLf/hoSD/7a2t/9pZWb/aGNi/5CQkv+Pk5f/gH6K/3Fqcv9dU13/Ix0f/xUTEv8ODQz/Dhke/xUPDP8VDwz/fHZ2/+Di4//r7e3/9Pb2//n6+f/5+vn/+fr6//b4+P/1+Pf/7/Tz/+/z8v/2+Pj/9Pf2//X39//X2Nf/o6Gf/3p0dP+PjY3/ys3O/5mYmf+ioqH/fHl4/5KXmv+Qjo//f3Vz/2VaWv8WEhH/ExQT/0JRWf8RExT/FRAN/xcRD/9fWVj/4ePj/+jp6f/y9PT/9/n5//v8+//9/vz/+vz6//r7+v/z9/b/8/b2//b5+P/z9vb/9ff3//T39//w9PP/7PHx/9HT0v+npKL/g4B//356ef/BxMT/pair/1hRUP9TQ0D/XVRU/wwJBf8QEA7/VGhy/yAlJ/8UDwz/FRAN/yIdGv/Ew8P/5+np//L09P/19/b//P37//v9+//9/fz/+fr6//f5+f/2+Pj/9/n5//X39//19/f/8/b1/+/08//w9fT/7/Py/+3x8P/t8vH/7fHx/8rP0P+3u7z/FREP/y0fIP8iIyb/CQYC/wsKB/9PZHP/PEVM/xINCv8OCgb/EAsI/zcwLf/U0NH/6uvq//T29v/2+Pf/+/z7//v8+v/3+fn/9ff3//f5+P/3+fj/9vj4//b4+P/y9PT/8fT0//D08//u8vH/7PDv/+/z8v/t8vH/4+jn/8LFxP8RCwb/HhYT/zU2OP8uKyj/DRAS/xIkPf8cKkf/DwoH/wwHA/8OCQb/GBIP/4mHh//d3dz/6+zr//Lz8v/09vX/9ff3//L09P/y9PT/8vT0//P19f/19/f/9Pb2//T29v/19/f/9/n5//Hz8//u8fH/7fHw/+js6//g5eT/wcLA/w0IBf8LBgP/PTo4/05HQf8xKyb/Mi4u/xcVFf8MBwP/CwYD/w0IBf8ZExH/b3Fx/3Z0d/++vLz/4uPh/+bn5f/p6+v/6Orq/+7w8P/x8/P/8/X1//X39//3+Pj/4Onz/7rO6f+txef/vc3l/+7w8P/o6+r/4uXl/+fr6/+ooZ3/JBgS/yggHv8ZFRT/ExEP/wwKBv8SDwz/DgsJ/woFAv8KBQL/DAcE/xoVFP9ucHL/Xl5i/0I6P/90a2r/oZ2c/8/Qz//t7+7/7vDw//Dy8f/19vT/9vj3/8PW7f+XuOP/ja7a/4ys2P+SrNP/5efn/+Dk4//j5+f/09bW/4iGhv9oZ2f/ZGVl/2RmaP9gZGj/RUlK/0pOUP9JTVD/CgYD/wgDAP8LBwT/HBgW/3Byc/9eXmL/Pjk9/05DQ/87Njb/ISIt/2JiaP/CxMX/6+3r/9Pb5f+Ws9v/eZ3N/3OZyv96ns//gKHQ/6m3zP/BwcH/sbGw/56dm/+Fg4D/gH57/3l5d/93d3b/dHV1/3BzdP9oa23/QUNC/z4+Pf8IBAH/CAMA/woGAv8fGxn/cXN0/2Rlaf9GREr/VExP/zo3Ov8XHSz/GCEz/yAxSv9ibn//V2qU/1h2qP9dfK7/bY2//26Pwv9wkMD/fIac/4SBf/+FgX//hIF+/4SBfv+CgHz/fXx7/317ev97enn/d3d2/3J0dP9qa2z/XmBh/wgEAf8KBQP/EAwN/yYjI/9xc3P/Z2Zs/1VUW/9pZWf/RU1Y/xUuSv8WLkr/GC5J/xsxTP9SY4r/aYe7/3CVyv94mc3/gqTW/4Kn2/92iqv/hoKA/4eEgf+GhIL/hoOB/4SCgP99fHz/e3l5/3h2d/90dHT/cHFx/3Fzdf9ydHX/DAgE/w4KB/8aFhb/MS8v/3Jzdf9nZmv/VVVb/2diYv9ETlv/EzBO/xIuSv8ULUr/HTRS/2h9q/9mjcH/T22n/2qBzf94jtb/bJHL/3mf0f+GiJD/ioeD/4mGgv+IhYL/hIKB/0xSWf9LXGb/QFdj/0hZYf9DT1j/XmVq/3Z4ef8QDAn/EQwK/wwHBP83NTX/dXR2/2ZlbP9VVVz/b2xs/0JLWP8RLk3/Dy1L/xAtS/9FUHf/dY/B/4Sm2v9KaJr/S2WX/1l3rv9vkML/ia3e/4SUsP+Lh4X/ioaD/2RgZf9VVFz/Ullg/05qdv9ca3T/Vmhw/1Rgaf9UXWT/enp8/wsHBP8KBgP/CgUC/0E/QP91dXX/ZWNr/0hGTf9kYGD/PUZV/w8uTv8PLEv/GTJV/1Rfi/9afrT/aoe+/1tzp/99lsr/dZHI/4mi1P+IpNP/g6DM/4yIif+Lh4b/fXl9/2tpb/9fYmf/YG51/2hudP9ca3H/W2hw/05XX/97eXv/CQQB/wkEAf8KBQL/S0hK/3V0df9mY2z/TktR/3Zsav8/R1f/Dy1N/w0pSv8XJ0T/QExx/z1Uh/9SWID/RVB6/2yCsP9nfa7/ZHqq/2uFvf9ceKf/iYeL/4yJif+Lion/ioiI/2psbv9SbHn/V295/2Vtc/9VYnD/S1Nd/3p5eP8KBQL/DAcD/w8KB/9UUVP/dHR2/2dja/9lXmT/joB7/0NKWv8QLk3/DipM/xMYJf9FSWX/RFFz/1FUcP9YX37/YXCM/11rj/9MWn3/Wl2D/01Pcf94dnj/i4mJ/4yKif+KiIj/dnV3/15iZ/9gYWb/Wlxj/1VZYP9OVFv/enl4/wsGA/8MCAT/Eg0K/1lYWP90cnT/amRr/3plZf/Knn7/U1Fe/xIwT/8PLE3/Exkm/09ljf9dh7//eqPZ/5e55v+gvef/pL/p/5W14P90ndD/R2OL/3Bscf+MiYn/jImJ/4uIiP+KhYj/hYOD/4B/f/9/e37/fHl7/3t5ef97eXj/DAcD/w4IBP8VEA3/XVpc/3Jycv9tZGr/g2tl/8+ffv9ZVF7/FDNR/xMvTv8UHSv/MjxX/2OHvP94o9r/i7Pl/5q76P+avOn/jrXm/3ai2P8wQFj/c21w/4F5e/+Mhoj/ioWI/4iDh/+CgIH/f35+/358fP98enn/e3l4/3h3d/8LBQL/DQgD/xcRDv9bV1v/cm9y/3Roaf+QdGf/1KiD/6GDdf+Ec3D/gHFx/3Vnaf8kHiD/HiEs/zlHX/9RZIX/aX6h/2+Ktf9ifKb/NEFc/0A/RP+Ae3//dm1v/4V/g/+Jgob/hICD/4B/f/9/fH3/fHp9/3p5ef95d3j/d3V6/w8HBP8WDgv/KB8c/1FGR/9vYGD/gGtm/6aAa//dsYj/x52D/6yOgP+gh4H/l4N//4Bxcf89Nzr/FxUZ/xYUGP8TERT/Dw0Q/xQSFP9JRkr/e3d8/3lzd/9lW1//cmpu/3l0d/93c3X/cm9y/25scP9sam3/amhs/2hlav9mY2f/PzIv/1pMSv9sXVv/emVi/4pwZP+sh2z/y5tv/8SMX/+ablj/fF5a/2pWV/9gUFX/WE1S/1JKUP9IREv/PDg//zgzOP9BPUT/UExR/1ROU/9VTlP/VU1S/1FITf9VTVH/cGlt/2llav9UUFT/Uk9S/1FOUP9QTVD/TktP/0xJTP96aGX/f2lk/4xwZP+rg2f/xpNj/7eCTf+SYUX/g1lG/2FIRf9PQEP/SD1E/0M8RP9CPET/QTxE/0E8Rf9DPUP/RT5F/0dBSP9LREn/TEVK/05GS/9PRUv/S0RH/05GSP9VT1P/TU1Q/0ZERv9JR0j/SUZI/0ZERf9EQkP/Qz9B/49yZv+wh23/zZhn/76FS/+KXUD/ZUdA/2NFQf9pSkL/UkA//0U7P/9EOUL/QjlB/0I4Qv9COEP/QzhD/0U6Q/9GO0X/ST1I/0tBSv9MREj/TkRI/09ESP9NREf/TENG/0U8Pf84NDX/R0NH/0JAQf9APj//QD4//z89Pf89Ojr/1qFy/86OVP+YY0H/bElA/1pBP/9WPj//WkFA/1xEQf9SQD//TD1B/0g8RP9HPEX/SDxG/0k8R/9IPEb/ST1H/0o+SP9KQEn/TENK/09GS/9SR0r/UUZL/1BFTP9PREz/VUtQ/11XW/9ZVlv/RUFF/0E9QP9APD//PTo7/zs3OP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAADAAAABgAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACdId/8sTHj/N1V+/0lihP98kab/u8bN/9DZ3P+iqK3/NDI0/xcTEv8WEhH/GRUU/z85O/+lqa7/qrS8/7O8xP/Dy8//zdPW/9Ta3P/V297/0tnc/9LZ3P/Q2Nv/z9bZ/9DY2//a4OL/3eLk/9/k5f/c4uT/2uDj/9ff4v/W3uD/0Nnc/8XP1f+/ytH/rbvC/1h9of80bKb/QV+h/1VChP8uHkD/GB8q/zhibP9KcX3/b4qX/3KUov9LcYL/QnuM/01mhf9ld47/fYmY/5qjq/+7wsb/0tjZ/9zh4v/Z3+D/q6+x/0A9Pf8ZFBP/GhQV/0I9Qf+2vcL/sbrB/7i/xv/L0tb/09nb/9fd3v/Y3t//2N7f/9bb3v/S2dv/1dvd/9zh4v/f5OX/4OXm/+Dl5v/d4+T/3OLk/9zi5P/c4eP/2N/h/87W2//EztT/s7/G/2aFpf84bKL/Smuf/2VqlP9BRGD/FRwl/y5NVv9Ecn3/SXSA/1+SoP9Ef43/S32N/4+Ynv+ZoKX/nqWo/6yytP/Fysz/2d3e/+Hl5v/i5uf/2d/h/7O2uP84NDX/GRQU/1dUWP+/yM3/usLJ/7jAxv/Q1tj/2d7f/9zh4v/c4eL/2+Dh/9bb3f/V293/3eLj/+Hm5//h5uj/4ebn/+Dl5v/f5OX/3uPk/97j5P/f5OX/2+Hj/9Tb3v/J0tj/uMPK/2uGov8uXo//K1mD/0Zzif9BaXj/Gi83/ytETf9Hd4X/OXB+/02FlP9Tj6D/X42d/5mgpP+epaj/o6qs/7K3uP/Izc7/2d7e/+Po6P/m6+v/4OXm/9LX2P9wcHD/Ixwe/3l1fP/Cyc3/xcvP/7rByP/U2dv/3eLi/9/k5f/f4+T/2+Dh/9jd3//d4uP/4+jp/+To6v/j6Or/4ufo/+Dl5v/g5eb/4OXm/9/k5v/g5eb/3uPk/9nf4v/O1tr/vcfN/3WLov8uUHn/K01r/zdpef87dYL/IkVQ/ys+SP9KcoD/RYSU/zhzg/9Qjp//Zput/5iepP+boqb/oKap/7G2uP/Lz9H/3OHh/+fs7P/t8fH/5uvr/9re4P+2ubv/hoSK/6epsP/M0dX/z9XY/8HHzf/Y3d7/4eXm/+Ln6P/f5OX/2+Dh/9zh4v/j5+n/5erq/+br7P/l6uv/4+jp/+Ln6P/i5+j/4ebn/+Dl5v/h5uf/4OXm/9zi4//R2dz/wcvQ/4GVqf8pR2z/HDNJ/ypdav8peYf/F1tq/yRAS/9BX2v/TomY/z+Glf9Bhpf/V5yt/6Oorv+pr7T/s7m8/8bKzP/Y3Nz/4ebm/+bq6//p7u3/6Ozs/+Pn6P/d4uL/1Nnb/8jO0v/U2Nr/1tvc/8zR1P/b4OH/5Onp/+Tp6v/f5OX/3OHi/+Ln6P/n7Ov/6Ozt/+jt7v/k6er/4+jq/+Tp6v/i5+j/4ebn/+Ln6P/h5uf/4ufo/97k5f/V3N//xs/W/42gs/8mRW//Ex4u/xkzOv8vdYP/N3+Q/yRUYv8tTVj/PGh1/0WNnP84j5//Ppmo/7i8v//EyMv/zNHR/9PX2P/c4OH/5uvq//H19P/z9/b/8PX0/+rv7v/g5eX/19vc/9PY2//Z3t//3eHi/9ba3f/f4+T/5uvr/+br6//f5OX/4ebo/+nt7f/p7u7/6+/w/+jt7v/l6uv/5err/+Xq6//j6On/4ufo/+Ln6P/i5+j/4ufo/9/k5v/Y3+L/y9TY/6CvwP87Un3/LCs9/yomLv9KZnL/YJKi/018jP8yWGX/Mlhl/zh2hf85kqH/Mpio/7u7vv/P09T/2+Df/+Ln5v/o7ez/8PT0//T39v/19/f/8fX1/+zx8f/l6ur/3ODh/9nd3v/c4eH/4+jn/9zh4v/j5+f/6+/v/+br7P/i5uj/6Ozt/+rv7//s8PH/6/Dw/+Tp6v/KztD/ztPW/+br7P/j6Or/4ufo/+Po6f/j6On/4+jp/+Hm5//b4eP/0dnc/6y3xv9QW4P/SzxN/zUoMP87QUz/VoGQ/02Elv9EaHf/PGZ1/zp6if9Fk6L/NZqo/7aytP/Lysz/4eXl/+js7P/s8fD/8PX0//X39//1+Pf/8/b2//H19f/r8O//4+jn/9/k5P/f5OP/5+zr/+Lm5v/l6un/7fLx/+br6//n6+v/6+/w/+vw7//v9PP/6/Dw/9fZ2v9uaGj/ZWBf/5mZnf/h5uf/4efo/+Tp6v/l6uv/5err/+Ln6P/e5OX/1t3g/7a9yP9wZH7/a0xT/zYmK/8nJSv/PVdi/2SMmv9SeIb/TneF/1mKmf9XmKb/Q5qn/z42Mv+po6P/3N7e/+js7f/u8vL/8vX1//T39//1+Pj/9/r5//X49//u8vH/6/Dv/+js7P/g5eT/5+vr/+Xq6v/p7u3/7vLy/+bq6//s8O//7PDw/+/08//w9fT/7/Tz/9fZ2v9zbnH/wcLE/3h2ef+Fho3/tbi9/9jd3//i5uj/5+zt/+Tp6v/g5eb/2eDi/7e8w/9VRVb/VDxB/zkpLf8uKi3/Mj5F/0Jodf9OgZD/RoKS/1uSov90obD/Wpyq/xcQCf9eWFX/0NDQ/9/i4v/j5eX/6u7u/+7y8v/w9PP/+Pr5//T39v/09/b/9vn4/+vw7//i5+b/6e7t/+fs7P/t8vH/7PDw/+nt7v/u8/L/7vLy//L29f/w9fT/8vb2/8fLzf+ampv/dXFz/6Okpv+Cf4H/jIqN/3l5fP+oq6//wMTI/+Tp6//h5uf/3OLj/7q7v/9EKjD/Rzc//1FKU/9OSE//S0lP/0RNVf9VdYH/X4qZ/2SVpP9lmKj/UpCg/xYQC/9PSkj/ycrL/9ze3v/g4uP/5efo/+3v7//2+Pf/+vz7//b49//7/Pv/+Pr5//D09P/q7u7/7fHx/+vv7//u8/L/6O3t/+3x8v/t8vH/8vX1//P39v/x9vX/8fb2/8rMzf9ybW3/amNl/3Rvc/+Cf4H/XldY/1xXWf+enp7/WVRU/4eHi/+ChYr/ydDS/8LGyv9gTFX/VkdQ/2hlcv9oYnH/TEVS/zEsMP8xNDn/PEpR/0RZYP9GZXH/L1xq/xYQDP8tJyT/rayr/97i4v/j5eb/5+nq/+3w8P/y9PT/9ff3//f4+P/7/Pv/+Pr5//b4+P/u8vL/8PTz//D09P/u8/L/6u/v/+7z8v/u8/L/9Pf3//X4+P/z9vb/zNDS/7u6vP+5ubr/oKCh/8fKy/+VlZf/VU5O/4SAgv+trq7/ZGBh/313d/+Bf4D/gIGD/3J1e/+eoav/cm19/25ncf9nXmr/U0dT/ycgI/8eGhz/EA4M/wwMCv8QFRj/CyAo/xUQDP8VEAz/LSYj/5iTlP/g4uP/7vHy/+/x8f/x8/P/9vj3//r7+v/6+/r/+Pv5//b4+P/19/f/8/b2//P29f/v8/L/7vPy/+7y8f/x9fT/9vj4//b4+P/z9vb/x8fI/46Hhf95c3T/e3Z2/5eUlf+2uLv/j4+Q/8HExf+9vr//VE1N/2RfXv+lpKX/Ylxc/2dmaf/Axcj/gX2C/3xzdv91bG//W1JV/yMcHv8YFBT/FBYW/yIpLP8WGBj/DhMU/xQPDP8VDwz/FQ8M/z84Nf/Kx8n/4ePj/+rs7P/z9fX/8vT0//f5+P/6+/r/+Pn4//r7+//4+/r/9vj4//b4+P/09/b/8PTz//D08//z9vX/9vn4//X49//z9vb/9vj4/+3v7//g4+L/ysvK/5iTkv9nX13/dXBv/6+vsf/M0NH/p6en/7KztP92c3L/pqam/3V6ff++w8X/aGFh/31zcP99cW7/WU5O/xURD/8MCQX/FhkZ/0lbZf8yO0D/EhUV/xQPDP8WEA3/FhAN/zErKP/DwcH/4+Xl/+fp6f/s7u7/9Pb2//j6+v/4+vn//P38//3+/P/8/fv/+fv6//v8+v/2+Pj/8fb1//L19f/09/f/9/r5//L19f/1+Pj/9fj4//T29v/z9vX/7/Tz/+zx8P/g5OT/rKuq/4J8eP9kXFr/bWho/3p0dP+amZn/tbi5/4uPk/+foaL/UklG/1JBPP93bGv/WlBP/xANCf8IBQH/FhgY/1Flbv9BT1b/DxAP/xQPDf8WEQ//FxIQ/yciH/+sqqr/4uTk/+Hh4f/v8fH/9Pb2//P19f/5+vn//P37//3+/P/8/fv/+/z6//z9+//3+fn/9fj3//X39//1+Pj/9vn4//P29v/2+Pj/9ff3//X4+P/x9fT/8PTz/+7y8v/w9PP/7/Pz/+7x8f/k5+b/xcfF/66urf/g5OX/m56g/6Snqf+Af4D/JSAf/zMhHf9GQET/LCgn/wsIBP8JBgL/EhIR/1Zsdf9ZbHX/GBob/xQPDP8TDgv/Ew4L/xINCv9PSkj/0c/Q/+jr6//s7+//8fPz//X39//5/Pr//f/9//z9/P/6/Pv//v78//n6+v/3+fn/9/n5//b4+P/3+fj/+Pr5//T29v/2+Pj/9ff3//T39v/w8/P/7/Py//H29f/w9fT/7vPx/+zx8P/t8vD/7vPy/+7y8f/q7+//0dbX/8TIyf9hX17/DgsH/ygbGv8yLTb/EhEP/wkGAv8JBgL/CwoI/0BRY/9XbX3/Jysv/xMOC/8RDAn/DgkF/w8KB/8WEA3/aF9d/9LOz//i4+P/7O7u//b4+P/3+fn/+Pr5//n6+f/9/fz/+/z6//f6+f/2+Pj/9vj4//f5+P/3+fj/+Pr5//X39//2+Pj/9vj4//P19f/x8/P/8fX0//H19P/u8/L/7vLx/+3x8P/t8vH/7/Ty/+7y8f/q7+7/4ubm/8zQ0P9gXFn/DwoF/yQcGf86Nzr/Hx4d/xsYFf8SEAz/CA0Q/xUmPv8eMVL/Iy9F/xEMCf8PCgf/DAgD/w4JBv8TDQr/HxcT/6ulpf/Y19f/6uvq//Dy8f/z9fT/+Pn4//r8+v/6+/r/9/n5//b4+P/z9vX/9ff3//T29v/19/f/9ff3//b4+P/2+Pj/9Pb2//P19f/y9fT/8/b2//P29v/y9fX/7vDw/+zv7v/v8/L/7vLx/+3x8P/m6+r/3uPi/9TY2P9iX1z/DQgE/w0IBf8fHBv/Uk9O/2FcWv85Mi3/HiEk/xwpN/8eIzH/EBYl/w8KB/8MBwP/DAgD/w0IBf8RDAn/GxUS/3Nxcf+np6b/4OHf/+fo5//r7Or/7e/u/+/x8f/19/b/9Pb2//L09P/x8/P/8PLy//P09P/y9PT/8/X1//X39//19/f/9Pb2//X39//19/f/9vf3//f5+f/z9vb/8vX1/+/x8f/u8vH/7PDv/+nt7P/h5uX/4+jn/9ba2P9UT0v/DAcE/woGAv8PDAn/SENB/0Q+Ov80LSf/Miok/zQtKP8sJiT/DgsL/w0IBP8KBQL/DAcD/w0IBP8PCgf/HRcV/25vbv9ycnP/kI6Q/9LR0P/g4d//4uPh/+fo5v/r7Oz/7O7u/+rs7P/r7e3/7/Hx//Dy8v/y9PT/8vT0//X39//29/f/9vj4//D09v/f6fP/vtHq/7TJ6f+1yej/1d7p/+/x8f/s7u7/6u3s/+Hk5P/l6ej/5+vr/9HT0f9UQjn/HxYS/yIbF/8ZFBL/Ew8M/xEOC/8OCwf/DgsH/xIOC/8UEQ//CgcE/wsHA/8KBQL/DAcD/w0JBf8QCwj/IBwb/21vcP9vcHL/V1VZ/19YXf+alpf/x8XD/+Dh3//j4+L/5ebl/+fo5//s7u7/7/Hx//Hz8//z9fX/9fb1//j49//4+vj/4+z0/7nP6v+gveP/mrjg/6K+4v+WtN7/obbW/+vt7f/n6ur/4uXk/+Pm5v/m6+r/4ebm/7/Av/9NREH/PDg3/0dBQf9APkD/Ojk7/zc4O/8nJyf/Gxsa/yEhIP8lJib/JSUm/wsGA/8IBAH/CQQB/woGA/8LBgP/Ih0c/25vcf9ucHL/U1JY/0A6P/9IPkD/ZFlW/3tzcv+Miov/1dXU/+7w7//u8PD/7/Hx/+7w8P/x8vH/+Pj1//n59//V4vD/qMXo/5m75P+Rs9//iqvZ/4ip1v+GptX/mq/P/+bo6P/g4+L/4eXk/+Lm5v/e4uL/vr+//4qJiP91c3L/cHFw/29wb/9tb2//a21v/2lscP9fY2b/V1te/1dcXv9YXV//UFRX/wwHBf8IAwD/CAMA/wwHBP8KBQL/KCUj/29xcv9vcHL/UlJX/z85Pv9BODv/VElG/09HRP8eHiX/Kiw2/3Z0ev/ExMX/4uPj/+rs6v/v8fD/5Ojt/7HG4/+TtN//iq/b/4Sp2P+BpNT/faHS/4Ci0v9+ncr/vsjU/9PU1f/P0dD/x8nJ/7a3tv+bmZf/hIJ+/4B+e/98enn/eHh3/3Z2df91dnT/cnR0/3Byc/9ucXP/YWVn/0RFRf9PUVH/ODc4/woGA/8IBAH/CAMA/wsGA/8KBQL/Kicl/29yc/9xc3X/VVVb/0E+Q/9AOj7/VUpK/05HRP8aGyP/GRso/xodKP8wNUT/dHyI/7m8wP+/xND/gJe//2qMv/9ZfK//VHer/1uAs/9libv/bZDC/3qbyv+DncX/nqCo/5iWlP+PjIr/hoOA/4OAff+DgH3/g4B9/4KAfP99fXr/e3p5/3t5eP96eXj/d3d2/3V1df9yc3T/bW5w/1VWVv9LS0v/PDw8/wgEAf8IBAH/BwMA/wsGA/8JBAH/MS0s/3Byc/9zdXb/XFxi/0tKUf9KRkz/YFha/1FNTv8WGyn/Fh4v/xYhNP8ZKUL/HzRN/zFDW/9BT23/U2aU/155qv9ifq7/bIq7/3GSxf95mMv/c5TI/2+Rwf9xjbf/gIGM/4OAfv+Fgn//hYF+/4SBfv+EgX7/hIF9/4OAfP+Afnv/fnx7/358e/98enn/fHp5/3l4d/92dnX/cnR0/29wcf9rbG7/ZGdp/wcDAP8JBQL/CQUC/woHBf8KBgT/OTY2/3Byc/9zdHX/Xl1l/1VUW/9WU1r/d3J0/2JkZ/8WKUH/FSxH/xctSP8XLkn/GS5K/xwwTP8pPFr/XW6Y/2mCtP9qi7//dZjO/4Oj2P+Ip9j/krLi/4ir3f90l8j/fYSW/4WAf/+GgoD/h4SC/4aEgv+GhIH/hYKA/4SBf/+Bf37/fnx8/317e/98enr/e3l5/3h4d/92dnX/c3R0/3Fzdf9ydHX/cHJz/woHA/8MCAT/CgYD/xgUFf8dGBr/QD9A/3Byc/9zdHX/Xl1l/1ZWXP9QTFH/eHR0/2RobP8VL0n/FTBO/xMuS/8ULkr/Fy5L/xgwTP84S2z/Z32s/26QxP9tlMv/a5DJ/3GRz/9sicP/f6Da/4Wr4P97o9n/d5C2/4aDhv+JhYL/iYaC/4iFgv+IhYL/iIWC/4aEg/97eXn/XF9j/19iaP9cYWb/Wl9k/1pfY/9XXWH/Ulhd/2Jna/90d3j/dHZ4/wsHA/8OCQb/DwoH/wwJB/8SDg3/SUhJ/3FzdP9zdHb/Xl1j/1ZWXP9RTVH/e3Z1/2Fkaf8UL0n/Ei9N/xEuS/8RLUn/EyxK/xgvTv9JWoD/aYO0/2yTx/9BYpb/Qlua/1hvwf9zhNT/boLS/1x9v/9nksj/fKHS/4ONov+Kh4T/i4iE/4qGgv+JhoL/h4OB/4OBgP9xcHL/P0lU/1ZncP9AX2z/QV5r/0xgav9MXWb/Qk1X/0tWXf91eHn/d3h6/xALCP8QCwj/Eg0L/w0IBv8MCAX/T01Q/3Rzdf90c3f/Xlxm/1ZWXf9WU1f/fXl4/19hZf8TLkn/ES5N/w8tS/8PLUv/ES1L/yk5W/9mcp3/c5LE/3yh1v9kiLz/L0Vv/0JZjP9mg7v/VXCo/1p5rP9kir3/harc/36Xu/+Kh4n/i4iF/4qHg/+BfXz/YF5i/1pZXv9kZWr/Qk1W/1Jrd/9OaXT/V2lz/1Vocf9UZ2//UVlj/0FOV/92eHr/enl7/xALCP8PCwj/DwoI/w0IBf8QDAn/VVRW/3Rzdf90c3b/Xlxm/1RUW/9TU1b/eXZ2/1tcY/8SLUn/EC5N/w8sS/8PLEz/FC9P/0VRfP9oe6n/aYa7/3iVyv+HpNf/TG6q/0Nbjf9kgrj/ZIbA/5i26P+gver/m7vo/4qm0/+Hi5f/i4iG/4uHg/+Cfn7/WlZf/0dEUP9naW7/R05X/1hsdv9fbXX/aG10/2FqcP9UaG//WmJr/z5LVf9zdXn/e3l8/woFAv8JBQL/CAUC/wkEAf8UEA7/Wlhb/3R0dP9zcnT/Xlxl/01LU/8+Oz7/cWtr/1ZXXv8RLEv/EC1N/w4sS/8PK03/JThf/1VYhf9TcaH/Xoa//2aIw/9phLn/RFaH/3yWy/+ZseD/b4m//3eQxP93ksX/dZLE/4Ok1f+Dkan/jYmI/4yIh/+Khof/f3x//3FudP+AfYD/T1Ra/15sc/9jcXj/ZW1z/15scv9aa3L/XWdw/0BKVP9ucXP/e3l7/wgDAP8IAwD/CAMA/wgEAf8ZFRP/Xlxf/3R0dP9zcXT/X1xn/1FOVv9ORkb/fHNx/1hXYP8SLEv/Dy1M/w0qSv8LKkv/IitM/0JHa/9CaZz/OlGF/0tekf9acqb/QUlx/1typP9/mcj/bYm9/3aSx/95lMr/c5bN/15+r/9wfZb/i4iJ/4uJif+Mion/i4mJ/4qIiP+Fg4P/WVxg/1lqcv9Jb37/WW52/2NvdP9fanL/VmJv/0JMV/9oa27/e3p5/woFAv8KBQL/CwYD/wwIBP8iHh3/YWBj/3Rzdf9ycHP/YV1o/1xYYP9pYmX/ioB+/1xbY/8VLkz/EC1M/w4qS/8OJ0b/Fhgj/zQyRP84Qmb/QUFo/1FFYv9LQlv/My1H/zg/V/9gbo//VmeZ/0NZh/9UZ5b/Wmyg/1hllv9hZnz/iIaH/4yJif+LiYn/jIqJ/4uJif+HhYX/YmRo/1Zkb/9bbXb/Z2tx/2VmbP9WX2v/Ulto/z9IVf9iZmr/e3l5/woFAv8LBgP/DAgD/w4JBv8oIyL/ZGNk/3Rzdv9xb3L/Y15n/2RcZP9/bmz/mId//15dY/8WL0z/EC1M/w0rTP8OJED/FRMY/0ZJaP9RZIv/UGWK/1Vlg/9aaYn/coiv/3uVvv+Albj/WWSF/0tPaf9bXXj/U09v/1RZe/9UVGH/hIKC/4yJif+LiYn/jIqJ/4uJiP+IhYb/b25x/11fZP9dXmT/XF1i/1pcYv9YWmD/Vlhf/1FVW/9ub3D/e3l4/woFAv8MBwP/DAgD/w8KB/8tKSj/ZmVm/3NydP9xbnL/Z2Bo/3BgZf+kgXD/y6CC/3BiZf8aMlD/ES9P/w8sTf8PJED/FxUd/0tZfP9bfrL/X4vE/3ag1f+PseD/nrzn/6O+6P+lv+j/p8Hn/5m23f+GptH/a5PE/1uCtP9CSFr/gX6A/4uJif+LiYn/i4mJ/4uJif+Lh4j/iYSH/4WDg/+BgYD/f35+/357fP99enz/e3l5/3p4eP97eXn/enh4/wsGA/8MCAP/DQgF/xALCP8xLS3/ZmVm/3Jyc/9xbXH/aWFo/3VkZf+rhG7/0aOC/3ZmZ/8eNlL/EjFQ/xEuTf8RKET/FBQa/zdFY/9cfbD/YIzF/3Og2f+Gr+L/kLfm/5y86P+bu+n/n7/r/5i76f+Er+L/caHZ/1N2o/87PUj/g36A/4qEhv+Mh4j/jYiJ/4yHiP+Lhoj/iYSH/4WDg/+CgID/gH9+/398fv9+e33/fHp6/3t5ef96eHj/eXh3/wsHA/8NCAP/DwgE/xELCf81MDD/Z2Vn/3Jxcv9xbXD/bGFn/3pnZP+xiHH/0KGB/3hkZP8hNlH/FTJR/xQvTv8VK0j/FBYe/yEjMf9MYIj/Y4m//3Oe1f+DrOD/jLPl/5a55/+au+n/mbvp/5G35/+Bq+H/cJvQ/zdJZv9DQUf/dW5w/3ducP+Hf4L/i4WJ/4qFif+KhIj/h4KG/4OAgf+Af3//f319/358e/98e3r/e3l4/3t5eP95d3f/d3Z2/woFAv8MBwL/DggD/xIMCf83MTL/ZmNm/3Fwcf9zbW//cmVm/4JsZf+2j3P/1amG/6GCc/90Y2P/bWJl/2xhZv9pXmT/W1BU/x4YG/8ZGCD/KjNH/0dcff9ifKT/cY22/3+awf+Fos3/g6XV/3ue0f9oiLn/OEdn/yEgJ/9jYGT/fHZ6/3Vrbv+BeHz/iIKH/4qDiP+Igob/hICD/4GAgP9/fX3/fnx8/317e/97eXr/enh4/3p4eP94dnr/d3V6/wsFAv8MBgL/DQgD/xMNCf8uJyj/WlNX/2tlZ/90amv/e2ln/45zZ/+/lnb/26+I/8SchP+xkYH/p4yB/6GJgv+ch4H/loOA/2ZZWv8mIiP/ExES/xQTFv8ZGSL/HyEv/y0yQ/8qMUT/MjpO/ywzRf8dHyr/KCcs/2FfY/+EgYb/gXx//3Jpa/91bG//g3yB/4aBhf+DgIL/gX9//4B+fv9+fH7/fHp9/3p4fP95d3v/d3Z4/3V0d/90cnf/dHF2/xAIA/8UDQn/HhUS/y4jIP9FOTj/X1FR/29fXv96Z2P/hm1l/6F7aP/KnHn/4rWO/9Cjhf+4k4H/qox//6GHgP+bhH//lYJ//499fP92amz/SEFG/xkXG/8YFRr/GBcb/xUSF/8ODQ7/Dw0O/xEPEP83NTn/ZWBm/3Vwdf90b3T/cWlu/2FYXP9hWFv/bWZq/3Fqbf9zbnD/b2pt/2pmav9oZGn/ZWNn/2VhZf9jYGT/Y19k/2FeY/9gXGH/X1tf/ysgHP8+Mi7/UkVD/2NUVP9vX13/eGRi/4BpY/+OcmX/p4Jq/8SYc//ToXX/yZBj/699X/+Wb1//hWZg/3lfXf9vWlv/Z1ZY/2FTV/9bUFX/Vk1T/0xIT/88OD//Mi83/ywoLf8uKi//PTo//05KT/9VUFX/V1BV/1dQVf9YT1X/Vk5T/1JKTv9SSU7/WVBU/29maf95c3f/ZF5k/1dRVv9UUVP/U1BT/1JQUf9TT1P/UU5S/1BNUf9QTFD/TUpO/2RUUv9uXlv/dWRh/3pnZP+BamP/jnFk/6SAZ/+6kGf/xpRk/76IWf+xek//nWtM/35XS/9oTkv/W0lK/1NFS/9OQ0v/S0JK/0lBSP9HQUf/RUFH/0VBSf9GQUn/RkJH/0hCSP9JREv/SkdM/01JTf9OSU7/T0lO/1BJT/9RSU//UEdN/05GS/9PRkr/U0pN/15XXP9nZmz/Xl5j/1BNUf9NSk3/TUtM/01KTP9MSUv/SkdJ/0lGSf9IRUf/RkRE/3xpZv9+aWT/g2tk/49xY/+mf2X/wJBp/8yXZP/BiE//om9C/4ZYQ/+AVUb/eFNE/2FHRP9RQUH/Sj1B/0Y7Q/9DOkL/QTpC/0E6Q/9AOkL/PzpD/z86RP9AOkP/QjxC/0Q8RP9GPUb/SEBI/0pDSP9LREj/TERJ/0xFSP9NRUr/TURJ/0tER/9MREb/TkVH/1FKTP9QTVD/PDk7/0A9P/9HRUb/SEZH/0dFRv9FQ0T/RUJE/0NBQv9CQED/Qj1A/4ZtZP+Sc2b/qIBp/8KSa//Qm2H/yIxQ/6ZvQv+AVkD/Z0dB/2NFQf9tSkL/aktC/1dCQP9JPT7/RDpA/0Q4Qf9DOEH/QThB/0A4Qv9AOEL/QDhC/0A4Qv9BOUL/QztC/0U6RP9HPEb/ST5J/0lASf9KQ0j/S0RH/01ESP9OREj/TkRI/0xDR/9MQ0b/TENG/0c/QP82Li//Lyws/0hGSP9GREb/Q0FC/0FAQP9BP0D/QT4//0A9Pv8+Ozz/Pjk6/6qDbP/ClnP/1Z5r/8yPV/+rdEX/h1s9/2pJPv9cQj7/V0A+/1pBP/9hRUH/X0VB/1NAPv9LPT//Rzw//0U6Qv9FOkP/RDpD/0U6RP9GOkT/RjpE/0Y6Rf9HO0X/SDtF/0g8Rv9JPUf/Sj9J/0xBSv9MQ0r/TkVK/1FGSf9RRkn/UUVK/09FS/9OREn/TERH/0lAQv9GPkD/SENG/0dDR/9GQ0b/QT5A/z89P/8/PD7/Pzw9/z47PP88Ojr/Ozg4/+GreP/bl1T/unhD/5BbQP9zTEH/YUNB/1lAQP9XPz//Vj4//1hBP/9dREL/WkRB/1RBP/9PPkH/TD1C/0k9RP9IPUX/SD1G/0k9R/9JPUf/Sj1H/0k9Rv9IPEb/Sj1H/0o+R/9KPkj/S0FJ/0xDSf9PREz/UEdL/1JHSv9SR0r/UUZM/1BFTf9PRU3/T0VN/1ZNU/9lXmP/bWlu/2hmbP9STlP/RD9E/0I+Qf9APUD/Pzw+/z07PP88ODn/OjY3/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562788/MWI%20Calculator%20IIFE.user.js
// @updateURL https://update.greasyfork.org/scripts/562788/MWI%20Calculator%20IIFE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function() {
        "use strict";

        function _f(f) {
            return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f
        }
        var li = {
            exports: {}
        },
            qa = {};
        var Df;

        function wd() {
            if (Df) return qa;
            Df = 1;
            var f = Symbol.for("react.transitional.element"),
                d = Symbol.for("react.fragment");

            function b(E, s, C) {
                var G = null;
                if (C !== void 0 && (G = "" + C), s.key !== void 0 && (G = "" + s.key), "key" in s) {
                    C = {};
                    for (var Z in s) Z !== "key" && (C[Z] = s[Z])
                } else C = s;
                return s = C.ref, {
                    $$typeof: f,
                    type: E,
                    key: G,
                    ref: s !== void 0 ? s : null,
                    props: C
                }
            }
            return qa.Fragment = d, qa.jsx = b, qa.jsxs = b, qa
        }
        var Of;

        function Wd() {
            return Of || (Of = 1, li.exports = wd()), li.exports
        }
        var p = Wd(),
            ei = {
                exports: {}
            },
            K = {},
            Uf;

        function kd() {
            if (Uf) return K;
            Uf = 1;
            var f = {
                env: {
                    NODE_ENV: "production"
                }
            };
            var d = Symbol.for("react.transitional.element"),
                b = Symbol.for("react.portal"),
                E = Symbol.for("react.fragment"),
                s = Symbol.for("react.strict_mode"),
                C = Symbol.for("react.profiler"),
                G = Symbol.for("react.consumer"),
                Z = Symbol.for("react.context"),
                O = Symbol.for("react.forward_ref"),
                S = Symbol.for("react.suspense"),
                L = Symbol.for("react.memo"),
                Y = Symbol.for("react.lazy"),
                R = Symbol.for("react.activity"),
                St = Symbol.iterator;

            function V(r) {
                return r === null || typeof r != "object" ? null : (r = St && r[St] || r["@@iterator"], typeof r == "function" ? r : null)
            }
            var nt = {
                isMounted: function() {
                    return !1
                },
                enqueueForceUpdate: function() {},
                enqueueReplaceState: function() {},
                enqueueSetState: function() {}
            },
                xt = Object.assign,
                Vt = {};

            function Ct(r, T, _) {
                this.props = r, this.context = T, this.refs = Vt, this.updater = _ || nt
            }
            Ct.prototype.isReactComponent = {}, Ct.prototype.setState = function(r, T) {
                if (typeof r != "object" && typeof r != "function" && r != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
                this.updater.enqueueSetState(this, r, T, "setState")
            }, Ct.prototype.forceUpdate = function(r) {
                this.updater.enqueueForceUpdate(this, r, "forceUpdate")
            };

            function pl() {}
            pl.prototype = Ct.prototype;

            function Mt(r, T, _) {
                this.props = r, this.context = T, this.refs = Vt, this.updater = _ || nt
            }
            var Kt = Mt.prototype = new pl;
            Kt.constructor = Mt, xt(Kt, Ct.prototype), Kt.isPureReactComponent = !0;
            var Jt = Array.isArray;

            function Nt() {}
            var P = {
                H: null,
                A: null,
                T: null,
                S: null
            },
                qt = Object.prototype.hasOwnProperty;

            function bl(r, T, _) {
                var N = _.ref;
                return {
                    $$typeof: d,
                    type: r,
                    key: T,
                    ref: N !== void 0 ? N : null,
                    props: _
                }
            }

            function Ol(r, T) {
                return bl(r.type, T, r.props)
            }

            function wt(r) {
                return typeof r == "object" && r !== null && r.$$typeof === d
            }

            function Pt(r) {
                var T = {
                    "=": "=0",
                    ":": "=2"
                };
                return "$" + r.replace(/[=:]/g, function(_) {
                    return T[_]
                })
            }
            var ue = /\/+/g;

            function il(r, T) {
                return typeof r == "object" && r !== null && r.key != null ? Pt("" + r.key) : T.toString(36)
            }

            function j(r) {
                switch (r.status) {
                    case "fulfilled":
                        return r.value;
                    case "rejected":
                        throw r.reason;
                    default:
                        switch (typeof r.status == "string" ? r.then(Nt, Nt) : (r.status = "pending", r.then(function(T) {
                            r.status === "pending" && (r.status = "fulfilled", r.value = T)
                        }, function(T) {
                            r.status === "pending" && (r.status = "rejected", r.reason = T)
                        })), r.status) {
                            case "fulfilled":
                                return r.value;
                            case "rejected":
                                throw r.reason
                        }
                }
                throw r
            }

            function M(r, T, _, N, W) {
                var k = typeof r;
                (k === "undefined" || k === "boolean") && (r = null);
                var ct = !1;
                if (r === null) ct = !0;
                else switch (k) {
                    case "bigint":
                    case "string":
                    case "number":
                        ct = !0;
                        break;
                    case "object":
                        switch (r.$$typeof) {
                            case d:
                            case b:
                                ct = !0;
                                break;
                            case Y:
                                return ct = r._init, M(ct(r._payload), T, _, N, W)
                        }
                }
                if (ct) return W = W(r), ct = N === "" ? "." + il(r, 0) : N, Jt(W) ? (_ = "", ct != null && (_ = ct.replace(ue, "$&/") + "/"), M(W, T, _, "", function(Ga) {
                    return Ga
                })) : W != null && (wt(W) && (W = Ol(W, _ + (W.key == null || r && r.key === W.key ? "" : ("" + W.key).replace(ue, "$&/") + "/") + ct)), T.push(W)), 1;
                ct = 0;
                var $t = N === "" ? "." : N + ":";
                if (Jt(r))
                    for (var Tt = 0; Tt < r.length; Tt++) N = r[Tt], k = $t + il(N, Tt), ct += M(N, T, _, k, W);
                else if (Tt = V(r), typeof Tt == "function")
                    for (r = Tt.call(r), Tt = 0; !(N = r.next()).done;) N = N.value, k = $t + il(N, Tt++), ct += M(N, T, _, k, W);
                else if (k === "object") {
                    if (typeof r.then == "function") return M(j(r), T, _, N, W);
                    throw T = String(r), Error("Objects are not valid as a React child (found: " + (T === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : T) + "). If you meant to render a collection of children, use an array instead.")
                }
                return ct
            }

            function U(r, T, _) {
                if (r == null) return r;
                var N = [],
                    W = 0;
                return M(r, N, "", "", function(k) {
                    return T.call(_, k, W++)
                }), N
            }

            function et(r) {
                if (r._status === -1) {
                    var T = r._result;
                    T = T(), T.then(function(_) {
                        (r._status === 0 || r._status === -1) && (r._status = 1, r._result = _)
                    }, function(_) {
                        (r._status === 0 || r._status === -1) && (r._status = 2, r._result = _)
                    }), r._status === -1 && (r._status = 0, r._result = T)
                }
                if (r._status === 1) return r._result.default;
                throw r._result
            }
            var mt = typeof reportError == "function" ? reportError : function(r) {
                if (typeof window == "object" && typeof window.ErrorEvent == "function") {
                    var T = new window.ErrorEvent("error", {
                        bubbles: !0,
                        cancelable: !0,
                        message: typeof r == "object" && r !== null && typeof r.message == "string" ? String(r.message) : String(r),
                        error: r
                    });
                    if (!window.dispatchEvent(T)) return
                } else if (typeof f == "object" && typeof f.emit == "function") {
                    f.emit("uncaughtException", r);
                    return
                }
                console.error(r)
            },
                kt = {
                    map: U,
                    forEach: function(r, T, _) {
                        U(r, function() {
                            T.apply(this, arguments)
                        }, _)
                    },
                    count: function(r) {
                        var T = 0;
                        return U(r, function() {
                            T++
                        }), T
                    },
                    toArray: function(r) {
                        return U(r, function(T) {
                            return T
                        }) || []
                    },
                    only: function(r) {
                        if (!wt(r)) throw Error("React.Children.only expected to receive a single React element child.");
                        return r
                    }
                };
            return K.Activity = R, K.Children = kt, K.Component = Ct, K.Fragment = E, K.Profiler = C, K.PureComponent = Mt, K.StrictMode = s, K.Suspense = S, K.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = P, K.__COMPILER_RUNTIME = {
                __proto__: null,
                c: function(r) {
                    return P.H.useMemoCache(r)
                }
            }, K.cache = function(r) {
                return function() {
                    return r.apply(null, arguments)
                }
            }, K.cacheSignal = function() {
                return null
            }, K.cloneElement = function(r, T, _) {
                if (r == null) throw Error("The argument must be a React element, but you passed " + r + ".");
                var N = xt({}, r.props),
                    W = r.key;
                if (T != null)
                    for (k in T.key !== void 0 && (W = "" + T.key), T) !qt.call(T, k) || k === "key" || k === "__self" || k === "__source" || k === "ref" && T.ref === void 0 || (N[k] = T[k]);
                var k = arguments.length - 2;
                if (k === 1) N.children = _;
                else if (1 < k) {
                    for (var ct = Array(k), $t = 0; $t < k; $t++) ct[$t] = arguments[$t + 2];
                    N.children = ct
                }
                return bl(r.type, W, N)
            }, K.createContext = function(r) {
                return r = {
                    $$typeof: Z,
                    _currentValue: r,
                    _currentValue2: r,
                    _threadCount: 0,
                    Provider: null,
                    Consumer: null
                }, r.Provider = r, r.Consumer = {
                    $$typeof: G,
                    _context: r
                }, r
            }, K.createElement = function(r, T, _) {
                var N, W = {},
                    k = null;
                if (T != null)
                    for (N in T.key !== void 0 && (k = "" + T.key), T) qt.call(T, N) && N !== "key" && N !== "__self" && N !== "__source" && (W[N] = T[N]);
                var ct = arguments.length - 2;
                if (ct === 1) W.children = _;
                else if (1 < ct) {
                    for (var $t = Array(ct), Tt = 0; Tt < ct; Tt++) $t[Tt] = arguments[Tt + 2];
                    W.children = $t
                }
                if (r && r.defaultProps)
                    for (N in ct = r.defaultProps, ct) W[N] === void 0 && (W[N] = ct[N]);
                return bl(r, k, W)
            }, K.createRef = function() {
                return {
                    current: null
                }
            }, K.forwardRef = function(r) {
                return {
                    $$typeof: O,
                    render: r
                }
            }, K.isValidElement = wt, K.lazy = function(r) {
                return {
                    $$typeof: Y,
                    _payload: {
                        _status: -1,
                        _result: r
                    },
                    _init: et
                }
            }, K.memo = function(r, T) {
                return {
                    $$typeof: L,
                    type: r,
                    compare: T === void 0 ? null : T
                }
            }, K.startTransition = function(r) {
                var T = P.T,
                    _ = {};
                P.T = _;
                try {
                    var N = r(),
                        W = P.S;
                    W !== null && W(_, N), typeof N == "object" && N !== null && typeof N.then == "function" && N.then(Nt, mt)
                } catch (k) {
                    mt(k)
                } finally {
                    T !== null && _.types !== null && (T.types = _.types), P.T = T
                }
            }, K.unstable_useCacheRefresh = function() {
                return P.H.useCacheRefresh()
            }, K.use = function(r) {
                return P.H.use(r)
            }, K.useActionState = function(r, T, _) {
                return P.H.useActionState(r, T, _)
            }, K.useCallback = function(r, T) {
                return P.H.useCallback(r, T)
            }, K.useContext = function(r) {
                return P.H.useContext(r)
            }, K.useDebugValue = function() {}, K.useDeferredValue = function(r, T) {
                return P.H.useDeferredValue(r, T)
            }, K.useEffect = function(r, T) {
                return P.H.useEffect(r, T)
            }, K.useEffectEvent = function(r) {
                return P.H.useEffectEvent(r)
            }, K.useId = function() {
                return P.H.useId()
            }, K.useImperativeHandle = function(r, T, _) {
                return P.H.useImperativeHandle(r, T, _)
            }, K.useInsertionEffect = function(r, T) {
                return P.H.useInsertionEffect(r, T)
            }, K.useLayoutEffect = function(r, T) {
                return P.H.useLayoutEffect(r, T)
            }, K.useMemo = function(r, T) {
                return P.H.useMemo(r, T)
            }, K.useOptimistic = function(r, T) {
                return P.H.useOptimistic(r, T)
            }, K.useReducer = function(r, T, _) {
                return P.H.useReducer(r, T, _)
            }, K.useRef = function(r) {
                return P.H.useRef(r)
            }, K.useState = function(r) {
                return P.H.useState(r)
            }, K.useSyncExternalStore = function(r, T, _) {
                return P.H.useSyncExternalStore(r, T, _)
            }, K.useTransition = function() {
                return P.H.useTransition()
            }, K.version = "19.2.3", K
        }
        var jf;

        function ai() {
            return jf || (jf = 1, ei.exports = kd()), ei.exports
        }
        var gt = ai();
        const $d = _f(gt);
        var ui = {
            exports: {}
        },
            Ya = {},
            ni = {
                exports: {}
            },
            ii = {};
        var Cf;

        function Fd() {
            return Cf || (Cf = 1, (function(f) {
                function d(j, M) {
                    var U = j.length;
                    j.push(M);
                    t: for (; 0 < U;) {
                        var et = U - 1 >>> 1,
                            mt = j[et];
                        if (0 < s(mt, M)) j[et] = M, j[U] = mt, U = et;
                        else break t
                    }
                }

                function b(j) {
                    return j.length === 0 ? null : j[0]
                }

                function E(j) {
                    if (j.length === 0) return null;
                    var M = j[0],
                        U = j.pop();
                    if (U !== M) {
                        j[0] = U;
                        t: for (var et = 0, mt = j.length, kt = mt >>> 1; et < kt;) {
                            var r = 2 * (et + 1) - 1,
                                T = j[r],
                                _ = r + 1,
                                N = j[_];
                            if (0 > s(T, U)) _ < mt && 0 > s(N, T) ? (j[et] = N, j[_] = U, et = _) : (j[et] = T, j[r] = U, et = r);
                            else if (_ < mt && 0 > s(N, U)) j[et] = N, j[_] = U, et = _;
                            else break t
                        }
                    }
                    return M
                }

                function s(j, M) {
                    var U = j.sortIndex - M.sortIndex;
                    return U !== 0 ? U : j.id - M.id
                }
                if (f.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
                    var C = performance;
                    f.unstable_now = function() {
                        return C.now()
                    }
                } else {
                    var G = Date,
                        Z = G.now();
                    f.unstable_now = function() {
                        return G.now() - Z
                    }
                }
                var O = [],
                    S = [],
                    L = 1,
                    Y = null,
                    R = 3,
                    St = !1,
                    V = !1,
                    nt = !1,
                    xt = !1,
                    Vt = typeof setTimeout == "function" ? setTimeout : null,
                    Ct = typeof clearTimeout == "function" ? clearTimeout : null,
                    pl = typeof setImmediate < "u" ? setImmediate : null;

                function Mt(j) {
                    for (var M = b(S); M !== null;) {
                        if (M.callback === null) E(S);
                        else if (M.startTime <= j) E(S), M.sortIndex = M.expirationTime, d(O, M);
                        else break;
                        M = b(S)
                    }
                }

                function Kt(j) {
                    if (nt = !1, Mt(j), !V)
                        if (b(O) !== null) V = !0, Jt || (Jt = !0, wt());
                        else {
                            var M = b(S);
                            M !== null && il(Kt, M.startTime - j)
                        }
                }
                var Jt = !1,
                    Nt = -1,
                    P = 5,
                    qt = -1;

                function bl() {
                    return xt ? !0 : !(f.unstable_now() - qt < P)
                }

                function Ol() {
                    if (xt = !1, Jt) {
                        var j = f.unstable_now();
                        qt = j;
                        var M = !0;
                        try {
                            t: {
                                V = !1,
                                    nt && (nt = !1, Ct(Nt), Nt = -1),
                                    St = !0;
                                var U = R;
                                try {
                                    l: {
                                        for (Mt(j), Y = b(O); Y !== null && !(Y.expirationTime > j && bl());) {
                                            var et = Y.callback;
                                            if (typeof et == "function") {
                                                Y.callback = null, R = Y.priorityLevel;
                                                var mt = et(Y.expirationTime <= j);
                                                if (j = f.unstable_now(), typeof mt == "function") {
                                                    Y.callback = mt, Mt(j), M = !0;
                                                    break l
                                                }
                                                Y === b(O) && E(O), Mt(j)
                                            } else E(O);
                                            Y = b(O)
                                        }
                                        if (Y !== null) M = !0;
                                        else {
                                            var kt = b(S);
                                            kt !== null && il(Kt, kt.startTime - j), M = !1
                                        }
                                    }
                                    break t
                                }
                                finally {
                                    Y = null, R = U, St = !1
                                }
                                M = void 0
                            }
                        }
                        finally {
                            M ? wt() : Jt = !1
                        }
                    }
                }
                var wt;
                if (typeof pl == "function") wt = function() {
                    pl(Ol)
                };
                else if (typeof MessageChannel < "u") {
                    var Pt = new MessageChannel,
                        ue = Pt.port2;
                    Pt.port1.onmessage = Ol, wt = function() {
                        ue.postMessage(null)
                    }
                } else wt = function() {
                    Vt(Ol, 0)
                };

                function il(j, M) {
                    Nt = Vt(function() {
                        j(f.unstable_now())
                    }, M)
                }
                f.unstable_IdlePriority = 5, f.unstable_ImmediatePriority = 1, f.unstable_LowPriority = 4, f.unstable_NormalPriority = 3, f.unstable_Profiling = null, f.unstable_UserBlockingPriority = 2, f.unstable_cancelCallback = function(j) {
                    j.callback = null
                }, f.unstable_forceFrameRate = function(j) {
                    0 > j || 125 < j ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P = 0 < j ? Math.floor(1e3 / j) : 5
                }, f.unstable_getCurrentPriorityLevel = function() {
                    return R
                }, f.unstable_next = function(j) {
                    switch (R) {
                        case 1:
                        case 2:
                        case 3:
                            var M = 3;
                            break;
                        default:
                            M = R
                    }
                    var U = R;
                    R = M;
                    try {
                        return j()
                    } finally {
                        R = U
                    }
                }, f.unstable_requestPaint = function() {
                    xt = !0
                }, f.unstable_runWithPriority = function(j, M) {
                    switch (j) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                            break;
                        default:
                            j = 3
                    }
                    var U = R;
                    R = j;
                    try {
                        return M()
                    } finally {
                        R = U
                    }
                }, f.unstable_scheduleCallback = function(j, M, U) {
                    var et = f.unstable_now();
                    switch (typeof U == "object" && U !== null ? (U = U.delay, U = typeof U == "number" && 0 < U ? et + U : et) : U = et, j) {
                        case 1:
                            var mt = -1;
                            break;
                        case 2:
                            mt = 250;
                            break;
                        case 5:
                            mt = 1073741823;
                            break;
                        case 4:
                            mt = 1e4;
                            break;
                        default:
                            mt = 5e3
                    }
                    return mt = U + mt, j = {
                        id: L++,
                        callback: M,
                        priorityLevel: j,
                        startTime: U,
                        expirationTime: mt,
                        sortIndex: -1
                    }, U > et ? (j.sortIndex = U, d(S, j), b(O) === null && j === b(S) && (nt ? (Ct(Nt), Nt = -1) : nt = !0, il(Kt, U - et))) : (j.sortIndex = mt, d(O, j), V || St || (V = !0, Jt || (Jt = !0, wt()))), j
                }, f.unstable_shouldYield = bl, f.unstable_wrapCallback = function(j) {
                    var M = R;
                    return function() {
                        var U = R;
                        R = M;
                        try {
                            return j.apply(this, arguments)
                        } finally {
                            R = U
                        }
                    }
                }
            })(ii)), ii
        }
        var Bf;

        function Pd() {
            return Bf || (Bf = 1, ni.exports = Fd()), ni.exports
        }
        var ci = {
            exports: {}
        },
            Lt = {};
        var Rf;

        function Id() {
            if (Rf) return Lt;
            Rf = 1;
            var f = ai();

            function d(O) {
                var S = "https://react.dev/errors/" + O;
                if (1 < arguments.length) {
                    S += "?args[]=" + encodeURIComponent(arguments[1]);
                    for (var L = 2; L < arguments.length; L++) S += "&args[]=" + encodeURIComponent(arguments[L])
                }
                return "Minified React error #" + O + "; visit " + S + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
            }

            function b() {}
            var E = {
                d: {
                    f: b,
                    r: function() {
                        throw Error(d(522))
                    },
                    D: b,
                    C: b,
                    L: b,
                    m: b,
                    X: b,
                    S: b,
                    M: b
                },
                p: 0,
                findDOMNode: null
            },
                s = Symbol.for("react.portal");

            function C(O, S, L) {
                var Y = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
                return {
                    $$typeof: s,
                    key: Y == null ? null : "" + Y,
                    children: O,
                    containerInfo: S,
                    implementation: L
                }
            }
            var G = f.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

            function Z(O, S) {
                if (O === "font") return "";
                if (typeof S == "string") return S === "use-credentials" ? S : ""
            }
            return Lt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = E, Lt.createPortal = function(O, S) {
                var L = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
                if (!S || S.nodeType !== 1 && S.nodeType !== 9 && S.nodeType !== 11) throw Error(d(299));
                return C(O, S, null, L)
            }, Lt.flushSync = function(O) {
                var S = G.T,
                    L = E.p;
                try {
                    if (G.T = null, E.p = 2, O) return O()
                } finally {
                    G.T = S, E.p = L, E.d.f()
                }
            }, Lt.preconnect = function(O, S) {
                typeof O == "string" && (S ? (S = S.crossOrigin, S = typeof S == "string" ? S === "use-credentials" ? S : "" : void 0) : S = null, E.d.C(O, S))
            }, Lt.prefetchDNS = function(O) {
                typeof O == "string" && E.d.D(O)
            }, Lt.preinit = function(O, S) {
                if (typeof O == "string" && S && typeof S.as == "string") {
                    var L = S.as,
                        Y = Z(L, S.crossOrigin),
                        R = typeof S.integrity == "string" ? S.integrity : void 0,
                        St = typeof S.fetchPriority == "string" ? S.fetchPriority : void 0;
                    L === "style" ? E.d.S(O, typeof S.precedence == "string" ? S.precedence : void 0, {
                        crossOrigin: Y,
                        integrity: R,
                        fetchPriority: St
                    }) : L === "script" && E.d.X(O, {
                        crossOrigin: Y,
                        integrity: R,
                        fetchPriority: St,
                        nonce: typeof S.nonce == "string" ? S.nonce : void 0
                    })
                }
            }, Lt.preinitModule = function(O, S) {
                if (typeof O == "string")
                    if (typeof S == "object" && S !== null) {
                        if (S.as == null || S.as === "script") {
                            var L = Z(S.as, S.crossOrigin);
                            E.d.M(O, {
                                crossOrigin: L,
                                integrity: typeof S.integrity == "string" ? S.integrity : void 0,
                                nonce: typeof S.nonce == "string" ? S.nonce : void 0
                            })
                        }
                    } else S == null && E.d.M(O)
            }, Lt.preload = function(O, S) {
                if (typeof O == "string" && typeof S == "object" && S !== null && typeof S.as == "string") {
                    var L = S.as,
                        Y = Z(L, S.crossOrigin);
                    E.d.L(O, L, {
                        crossOrigin: Y,
                        integrity: typeof S.integrity == "string" ? S.integrity : void 0,
                        nonce: typeof S.nonce == "string" ? S.nonce : void 0,
                        type: typeof S.type == "string" ? S.type : void 0,
                        fetchPriority: typeof S.fetchPriority == "string" ? S.fetchPriority : void 0,
                        referrerPolicy: typeof S.referrerPolicy == "string" ? S.referrerPolicy : void 0,
                        imageSrcSet: typeof S.imageSrcSet == "string" ? S.imageSrcSet : void 0,
                        imageSizes: typeof S.imageSizes == "string" ? S.imageSizes : void 0,
                        media: typeof S.media == "string" ? S.media : void 0
                    })
                }
            }, Lt.preloadModule = function(O, S) {
                if (typeof O == "string")
                    if (S) {
                        var L = Z(S.as, S.crossOrigin);
                        E.d.m(O, {
                            as: typeof S.as == "string" && S.as !== "script" ? S.as : void 0,
                            crossOrigin: L,
                            integrity: typeof S.integrity == "string" ? S.integrity : void 0
                        })
                    } else E.d.m(O)
            }, Lt.requestFormReset = function(O) {
                E.d.r(O)
            }, Lt.unstable_batchedUpdates = function(O, S) {
                return O(S)
            }, Lt.useFormState = function(O, S, L) {
                return G.H.useFormState(O, S, L)
            }, Lt.useFormStatus = function() {
                return G.H.useHostTransitionStatus()
            }, Lt.version = "19.2.3", Lt
        }
        var Nf;

        function t0() {
            if (Nf) return ci.exports;
            Nf = 1;

            function f() {
                if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
                    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(f)
                } catch (d) {
                    console.error(d)
                }
            }
            return f(), ci.exports = Id(), ci.exports
        }
        var qf;

        function l0() {
            if (qf) return Ya;
            qf = 1;
            var f = {
                env: {
                    NODE_ENV: "production"
                }
            };
            var d = Pd(),
                b = ai(),
                E = t0();

            function s(t) {
                var l = "https://react.dev/errors/" + t;
                if (1 < arguments.length) {
                    l += "?args[]=" + encodeURIComponent(arguments[1]);
                    for (var e = 2; e < arguments.length; e++) l += "&args[]=" + encodeURIComponent(arguments[e])
                }
                return "Minified React error #" + t + "; visit " + l + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
            }

            function C(t) {
                return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11)
            }

            function G(t) {
                var l = t,
                    e = t;
                if (t.alternate)
                    for (; l.return;) l = l.return;
                else {
                    t = l;
                    do l = t, (l.flags & 4098) !== 0 && (e = l.return), t = l.return; while (t)
                }
                return l.tag === 3 ? e : null
                }

                function Z(t) {
                    if (t.tag === 13) {
                        var l = t.memoizedState;
                        if (l === null && (t = t.alternate, t !== null && (l = t.memoizedState)), l !== null) return l.dehydrated
                    }
                    return null
                }

                function O(t) {
                    if (t.tag === 31) {
                        var l = t.memoizedState;
                        if (l === null && (t = t.alternate, t !== null && (l = t.memoizedState)), l !== null) return l.dehydrated
                    }
                    return null
                }

                function S(t) {
                    if (G(t) !== t) throw Error(s(188))
                }

                function L(t) {
                    var l = t.alternate;
                    if (!l) {
                        if (l = G(t), l === null) throw Error(s(188));
                        return l !== t ? null : t
                    }
                    for (var e = t, a = l;;) {
                        var u = e.return;
                        if (u === null) break;
                        var n = u.alternate;
                        if (n === null) {
                            if (a = u.return, a !== null) {
                                e = a;
                                continue
                            }
                            break
                        }
                        if (u.child === n.child) {
                            for (n = u.child; n;) {
                                if (n === e) return S(u), t;
                                if (n === a) return S(u), l;
                                n = n.sibling
                            }
                            throw Error(s(188))
                        }
                        if (e.return !== a.return) e = u, a = n;
                        else {
                            for (var i = !1, c = u.child; c;) {
                                if (c === e) {
                                    i = !0, e = u, a = n;
                                    break
                                }
                                if (c === a) {
                                    i = !0, a = u, e = n;
                                    break
                                }
                                c = c.sibling
                            }
                            if (!i) {
                                for (c = n.child; c;) {
                                    if (c === e) {
                                        i = !0, e = n, a = u;
                                        break
                                    }
                                    if (c === a) {
                                        i = !0, a = n, e = u;
                                        break
                                    }
                                    c = c.sibling
                                }
                                if (!i) throw Error(s(189))
                            }
                        }
                        if (e.alternate !== a) throw Error(s(190))
                    }
                    if (e.tag !== 3) throw Error(s(188));
                    return e.stateNode.current === e ? t : l
                }

                function Y(t) {
                    var l = t.tag;
                    if (l === 5 || l === 26 || l === 27 || l === 6) return t;
                    for (t = t.child; t !== null;) {
                        if (l = Y(t), l !== null) return l;
                        t = t.sibling
                    }
                    return null
                }
                var R = Object.assign,
                    St = Symbol.for("react.element"),
                    V = Symbol.for("react.transitional.element"),
                    nt = Symbol.for("react.portal"),
                    xt = Symbol.for("react.fragment"),
                    Vt = Symbol.for("react.strict_mode"),
                    Ct = Symbol.for("react.profiler"),
                    pl = Symbol.for("react.consumer"),
                    Mt = Symbol.for("react.context"),
                    Kt = Symbol.for("react.forward_ref"),
                    Jt = Symbol.for("react.suspense"),
                    Nt = Symbol.for("react.suspense_list"),
                    P = Symbol.for("react.memo"),
                    qt = Symbol.for("react.lazy"),
                    bl = Symbol.for("react.activity"),
                    Ol = Symbol.for("react.memo_cache_sentinel"),
                    wt = Symbol.iterator;

                function Pt(t) {
                    return t === null || typeof t != "object" ? null : (t = wt && t[wt] || t["@@iterator"], typeof t == "function" ? t : null)
                }
                var ue = Symbol.for("react.client.reference");

                function il(t) {
                    if (t == null) return null;
                    if (typeof t == "function") return t.$$typeof === ue ? null : t.displayName || t.name || null;
                    if (typeof t == "string") return t;
                    switch (t) {
                        case xt:
                            return "Fragment";
                        case Ct:
                            return "Profiler";
                        case Vt:
                            return "StrictMode";
                        case Jt:
                            return "Suspense";
                        case Nt:
                            return "SuspenseList";
                        case bl:
                            return "Activity"
                    }
                    if (typeof t == "object") switch (t.$$typeof) {
                        case nt:
                            return "Portal";
                        case Mt:
                            return t.displayName || "Context";
                        case pl:
                            return (t._context.displayName || "Context") + ".Consumer";
                        case Kt:
                            var l = t.render;
                            return t = t.displayName, t || (t = l.displayName || l.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
                        case P:
                            return l = t.displayName || null, l !== null ? l : il(t.type) || "Memo";
                        case qt:
                            l = t._payload, t = t._init;
                            try {
                                return il(t(l))
                            } catch {}
                    }
                    return null
                }
                var j = Array.isArray,
                    M = b.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
                    U = E.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
                    et = {
                        pending: !1,
                        data: null,
                        method: null,
                        action: null
                    },
                    mt = [],
                    kt = -1;

                function r(t) {
                    return {
                        current: t
                    }
                }

                function T(t) {
                    0 > kt || (t.current = mt[kt], mt[kt] = null, kt--)
                }

                function _(t, l) {
                    kt++, mt[kt] = t.current, t.current = l
                }
                var N = r(null),
                    W = r(null),
                    k = r(null),
                    ct = r(null);

                function $t(t, l) {
                    switch (_(k, l), _(W, t), _(N, null), l.nodeType) {
                        case 9:
                        case 11:
                            t = (t = l.documentElement) && (t = t.namespaceURI) ? vd(t) : 0;
                            break;
                        default:
                            if (t = l.tagName, l = l.namespaceURI) l = vd(l), t = gd(l, t);
                            else switch (t) {
                                case "svg":
                                    t = 1;
                                    break;
                                case "math":
                                    t = 2;
                                    break;
                                default:
                                    t = 0
                            }
                    }
                    T(N), _(N, t)
                }

                function Tt() {
                    T(N), T(W), T(k)
                }

                function Ga(t) {
                    t.memoizedState !== null && _(ct, t);
                    var l = N.current,
                        e = gd(l, t.type);
                    l !== e && (_(W, t), _(N, e))
                }

                function Nu(t) {
                    W.current === t && (T(N), T(W)), ct.current === t && (T(ct), _u._currentValue = et)
                }
                var oi, Kf;

                function Ue(t) {
                    if (oi === void 0) try {
                        throw Error()
                    } catch (e) {
                        var l = e.stack.trim().match(/\n( *(at )?)/);
                        oi = l && l[1] || "", Kf = -1 < e.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : ""
                    }
                    return `
` + oi + t + Kf
                }
                var si = !1;

                function ri(t, l) {
                    if (!t || si) return "";
                    si = !0;
                    var e = Error.prepareStackTrace;
                    Error.prepareStackTrace = void 0;
                    try {
                        var a = {
                            DetermineComponentFrameRoot: function() {
                                try {
                                    if (l) {
                                        var H = function() {
                                            throw Error()
                                        };
                                        if (Object.defineProperty(H.prototype, "props", {
                                            set: function() {
                                                throw Error()
                                            }
                                        }), typeof Reflect == "object" && Reflect.construct) {
                                            try {
                                                Reflect.construct(H, [])
                                            } catch (x) {
                                                var g = x
                                                }
                                            Reflect.construct(t, [], H)
                                        } else {
                                            try {
                                                H.call()
                                            } catch (x) {
                                                g = x
                                            }
                                            t.call(H.prototype)
                                        }
                                    } else {
                                        try {
                                            throw Error()
                                        } catch (x) {
                                            g = x
                                        }(H = t()) && typeof H.catch == "function" && H.catch(function() {})
                                    }
                                } catch (x) {
                                    if (x && g && typeof x.stack == "string") return [x.stack, g.stack]
                                }
                                return [null, null]
                            }
                        };
                        a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
                        var u = Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot, "name");
                        u && u.configurable && Object.defineProperty(a.DetermineComponentFrameRoot, "name", {
                            value: "DetermineComponentFrameRoot"
                        });
                        var n = a.DetermineComponentFrameRoot(),
                            i = n[0],
                            c = n[1];
                        if (i && c) {
                            var o = i.split(`
`),
                                v = c.split(`
`);
                            for (u = a = 0; a < o.length && !o[a].includes("DetermineComponentFrameRoot");) a++;
                            for (; u < v.length && !v[u].includes("DetermineComponentFrameRoot");) u++;
                            if (a === o.length || u === v.length)
                                for (a = o.length - 1, u = v.length - 1; 1 <= a && 0 <= u && o[a] !== v[u];) u--;
                            for (; 1 <= a && 0 <= u; a--, u--)
                                if (o[a] !== v[u]) {
                                    if (a !== 1 || u !== 1)
                                        do
                                            if (a--, u--, 0 > u || o[a] !== v[u]) {
                                                var z = `
` + o[a].replace(" at new ", " at ");
                                                return t.displayName && z.includes("<anonymous>") && (z = z.replace("<anonymous>", t.displayName)), z
                                            } while (1 <= a && 0 <= u);
                                    break
                                }
                        }
                    } finally {
                        si = !1, Error.prepareStackTrace = e
                    }
                    return (e = t ? t.displayName || t.name : "") ? Ue(e) : ""
                }

                function X0(t, l) {
                    switch (t.tag) {
                        case 26:
                        case 27:
                        case 5:
                            return Ue(t.type);
                        case 16:
                            return Ue("Lazy");
                        case 13:
                            return t.child !== l && l !== null ? Ue("Suspense Fallback") : Ue("Suspense");
                        case 19:
                            return Ue("SuspenseList");
                        case 0:
                        case 15:
                            return ri(t.type, !1);
                        case 11:
                            return ri(t.type.render, !1);
                        case 1:
                            return ri(t.type, !0);
                        case 31:
                            return Ue("Activity");
                        default:
                            return ""
                    }
                }

                function Jf(t) {
                    try {
                        var l = "",
                            e = null;
                        do l += X0(t, e), e = t, t = t.return; while (t);
                        return l
                    } catch (a) {
                        return `
Error generating stack: ` + a.message + `
` + a.stack
                    }
                }
                var di = Object.prototype.hasOwnProperty,
                    mi = d.unstable_scheduleCallback,
                    yi = d.unstable_cancelCallback,
                    Q0 = d.unstable_shouldYield,
                    Z0 = d.unstable_requestPaint,
                    cl = d.unstable_now,
                    L0 = d.unstable_getCurrentPriorityLevel,
                    wf = d.unstable_ImmediatePriority,
                    Wf = d.unstable_UserBlockingPriority,
                    qu = d.unstable_NormalPriority,
                    V0 = d.unstable_LowPriority,
                    kf = d.unstable_IdlePriority,
                    K0 = d.log,
                    J0 = d.unstable_setDisableYieldValue,
                    Xa = null,
                    fl = null;

                function ne(t) {
                    if (typeof K0 == "function" && J0(t), fl && typeof fl.setStrictMode == "function") try {
                        fl.setStrictMode(Xa, t)
                    } catch {}
                }
                var ol = Math.clz32 ? Math.clz32 : k0,
                    w0 = Math.log,
                    W0 = Math.LN2;

                function k0(t) {
                    return t >>>= 0, t === 0 ? 32 : 31 - (w0(t) / W0 | 0) | 0
                }
                var Yu = 256,
                    Gu = 262144,
                    Xu = 4194304;

                function je(t) {
                    var l = t & 42;
                    if (l !== 0) return l;
                    switch (t & -t) {
                        case 1:
                            return 1;
                        case 2:
                            return 2;
                        case 4:
                            return 4;
                        case 8:
                            return 8;
                        case 16:
                            return 16;
                        case 32:
                            return 32;
                        case 64:
                            return 64;
                        case 128:
                            return 128;
                        case 256:
                        case 512:
                        case 1024:
                        case 2048:
                        case 4096:
                        case 8192:
                        case 16384:
                        case 32768:
                        case 65536:
                        case 131072:
                            return t & 261888;
                        case 262144:
                        case 524288:
                        case 1048576:
                        case 2097152:
                            return t & 3932160;
                        case 4194304:
                        case 8388608:
                        case 16777216:
                        case 33554432:
                            return t & 62914560;
                        case 67108864:
                            return 67108864;
                        case 134217728:
                            return 134217728;
                        case 268435456:
                            return 268435456;
                        case 536870912:
                            return 536870912;
                        case 1073741824:
                            return 0;
                        default:
                            return t
                    }
                }

                function Qu(t, l, e) {
                    var a = t.pendingLanes;
                    if (a === 0) return 0;
                    var u = 0,
                        n = t.suspendedLanes,
                        i = t.pingedLanes;
                    t = t.warmLanes;
                    var c = a & 134217727;
                    return c !== 0 ? (a = c & ~n, a !== 0 ? u = je(a) : (i &= c, i !== 0 ? u = je(i) : e || (e = c & ~t, e !== 0 && (u = je(e))))) : (c = a & ~n, c !== 0 ? u = je(c) : i !== 0 ? u = je(i) : e || (e = a & ~t, e !== 0 && (u = je(e)))), u === 0 ? 0 : l !== 0 && l !== u && (l & n) === 0 && (n = u & -u, e = l & -l, n >= e || n === 32 && (e & 4194048) !== 0) ? l : u
                }

                function Qa(t, l) {
                    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & l) === 0
                }

                function $0(t, l) {
                    switch (t) {
                        case 1:
                        case 2:
                        case 4:
                        case 8:
                        case 64:
                            return l + 250;
                        case 16:
                        case 32:
                        case 128:
                        case 256:
                        case 512:
                        case 1024:
                        case 2048:
                        case 4096:
                        case 8192:
                        case 16384:
                        case 32768:
                        case 65536:
                        case 131072:
                        case 262144:
                        case 524288:
                        case 1048576:
                        case 2097152:
                            return l + 5e3;
                        case 4194304:
                        case 8388608:
                        case 16777216:
                        case 33554432:
                            return -1;
                        case 67108864:
                        case 134217728:
                        case 268435456:
                        case 536870912:
                        case 1073741824:
                            return -1;
                        default:
                            return -1
                    }
                }

                function $f() {
                    var t = Xu;
                    return Xu <<= 1, (Xu & 62914560) === 0 && (Xu = 4194304), t
                }

                function hi(t) {
                    for (var l = [], e = 0; 31 > e; e++) l.push(t);
                    return l
                }

                function Za(t, l) {
                    t.pendingLanes |= l, l !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0)
                }

                function F0(t, l, e, a, u, n) {
                    var i = t.pendingLanes;
                    t.pendingLanes = e, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= e, t.entangledLanes &= e, t.errorRecoveryDisabledLanes &= e, t.shellSuspendCounter = 0;
                    var c = t.entanglements,
                        o = t.expirationTimes,
                        v = t.hiddenUpdates;
                    for (e = i & ~e; 0 < e;) {
                        var z = 31 - ol(e),
                            H = 1 << z;
                        c[z] = 0, o[z] = -1;
                        var g = v[z];
                        if (g !== null)
                            for (v[z] = null, z = 0; z < g.length; z++) {
                                var x = g[z];
                                x !== null && (x.lane &= -536870913)
                            }
                        e &= ~H
                    }
                    a !== 0 && Ff(t, a, 0), n !== 0 && u === 0 && t.tag !== 0 && (t.suspendedLanes |= n & ~(i & ~l))
                }

                function Ff(t, l, e) {
                    t.pendingLanes |= l, t.suspendedLanes &= ~l;
                    var a = 31 - ol(l);
                    t.entangledLanes |= l, t.entanglements[a] = t.entanglements[a] | 1073741824 | e & 261930
                }

                function Pf(t, l) {
                    var e = t.entangledLanes |= l;
                    for (t = t.entanglements; e;) {
                        var a = 31 - ol(e),
                            u = 1 << a;
                        u & l | t[a] & l && (t[a] |= l), e &= ~u
                    }
                }

                function If(t, l) {
                    var e = l & -l;
                    return e = (e & 42) !== 0 ? 1 : vi(e), (e & (t.suspendedLanes | l)) !== 0 ? 0 : e
                }

                function vi(t) {
                    switch (t) {
                        case 2:
                            t = 1;
                            break;
                        case 8:
                            t = 4;
                            break;
                        case 32:
                            t = 16;
                            break;
                        case 256:
                        case 512:
                        case 1024:
                        case 2048:
                        case 4096:
                        case 8192:
                        case 16384:
                        case 32768:
                        case 65536:
                        case 131072:
                        case 262144:
                        case 524288:
                        case 1048576:
                        case 2097152:
                        case 4194304:
                        case 8388608:
                        case 16777216:
                        case 33554432:
                            t = 128;
                            break;
                        case 268435456:
                            t = 134217728;
                            break;
                        default:
                            t = 0
                    }
                    return t
                }

                function gi(t) {
                    return t &= -t, 2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2
                }

                function to() {
                    var t = U.p;
                    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : Xd(t.type))
                }

                function lo(t, l) {
                    var e = U.p;
                    try {
                        return U.p = t, l()
                    } finally {
                        U.p = e
                    }
                }
                var ie = Math.random().toString(36).slice(2),
                    Yt = "__reactFiber$" + ie,
                    It = "__reactProps$" + ie,
                    Ie = "__reactContainer$" + ie,
                    pi = "__reactEvents$" + ie,
                    P0 = "__reactListeners$" + ie,
                    I0 = "__reactHandles$" + ie,
                    eo = "__reactResources$" + ie,
                    La = "__reactMarker$" + ie;

                function bi(t) {
                    delete t[Yt], delete t[It], delete t[pi], delete t[P0], delete t[I0]
                }

                function ta(t) {
                    var l = t[Yt];
                    if (l) return l;
                    for (var e = t.parentNode; e;) {
                        if (l = e[Ie] || e[Yt]) {
                            if (e = l.alternate, l.child !== null || e !== null && e.child !== null)
                                for (t = Td(t); t !== null;) {
                                    if (e = t[Yt]) return e;
                                    t = Td(t)
                                }
                            return l
                        }
                        t = e, e = t.parentNode
                    }
                    return null
                }

                function la(t) {
                    if (t = t[Yt] || t[Ie]) {
                        var l = t.tag;
                        if (l === 5 || l === 6 || l === 13 || l === 31 || l === 26 || l === 27 || l === 3) return t
                    }
                    return null
                }

                function Va(t) {
                    var l = t.tag;
                    if (l === 5 || l === 26 || l === 27 || l === 6) return t.stateNode;
                    throw Error(s(33))
                }

                function ea(t) {
                    var l = t[eo];
                    return l || (l = t[eo] = {
                        hoistableStyles: new Map,
                        hoistableScripts: new Map
                    }), l
                }

                function Bt(t) {
                    t[La] = !0
                }
                var ao = new Set,
                    uo = {};

                function Ce(t, l) {
                    aa(t, l), aa(t + "Capture", l)
                }

                function aa(t, l) {
                    for (uo[t] = l, t = 0; t < l.length; t++) ao.add(l[t])
                }
                var tm = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),
                    no = {},
                    io = {};

                function lm(t) {
                    return di.call(io, t) ? !0 : di.call(no, t) ? !1 : tm.test(t) ? io[t] = !0 : (no[t] = !0, !1)
                }

                function Zu(t, l, e) {
                    if (lm(l))
                        if (e === null) t.removeAttribute(l);
                        else {
                            switch (typeof e) {
                                case "undefined":
                                case "function":
                                case "symbol":
                                    t.removeAttribute(l);
                                    return;
                                case "boolean":
                                    var a = l.toLowerCase().slice(0, 5);
                                    if (a !== "data-" && a !== "aria-") {
                                        t.removeAttribute(l);
                                        return
                                    }
                            }
                            t.setAttribute(l, "" + e)
                        }
                }

                function Lu(t, l, e) {
                    if (e === null) t.removeAttribute(l);
                    else {
                        switch (typeof e) {
                            case "undefined":
                            case "function":
                            case "symbol":
                            case "boolean":
                                t.removeAttribute(l);
                                return
                        }
                        t.setAttribute(l, "" + e)
                    }
                }

                function Gl(t, l, e, a) {
                    if (a === null) t.removeAttribute(e);
                    else {
                        switch (typeof a) {
                            case "undefined":
                            case "function":
                            case "symbol":
                            case "boolean":
                                t.removeAttribute(e);
                                return
                        }
                        t.setAttributeNS(l, e, "" + a)
                    }
                }

                function Sl(t) {
                    switch (typeof t) {
                        case "bigint":
                        case "boolean":
                        case "number":
                        case "string":
                        case "undefined":
                            return t;
                        case "object":
                            return t;
                        default:
                            return ""
                    }
                }

                function co(t) {
                    var l = t.type;
                    return (t = t.nodeName) && t.toLowerCase() === "input" && (l === "checkbox" || l === "radio")
                }

                function em(t, l, e) {
                    var a = Object.getOwnPropertyDescriptor(t.constructor.prototype, l);
                    if (!t.hasOwnProperty(l) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
                        var u = a.get,
                            n = a.set;
                        return Object.defineProperty(t, l, {
                            configurable: !0,
                            get: function() {
                                return u.call(this)
                            },
                            set: function(i) {
                                e = "" + i, n.call(this, i)
                            }
                        }), Object.defineProperty(t, l, {
                            enumerable: a.enumerable
                        }), {
                            getValue: function() {
                                return e
                            },
                            setValue: function(i) {
                                e = "" + i
                            },
                            stopTracking: function() {
                                t._valueTracker = null, delete t[l]
                            }
                        }
                    }
                }

                function Si(t) {
                    if (!t._valueTracker) {
                        var l = co(t) ? "checked" : "value";
                        t._valueTracker = em(t, l, "" + t[l])
                    }
                }

                function fo(t) {
                    if (!t) return !1;
                    var l = t._valueTracker;
                    if (!l) return !0;
                    var e = l.getValue(),
                        a = "";
                    return t && (a = co(t) ? t.checked ? "true" : "false" : t.value), t = a, t !== e ? (l.setValue(t), !0) : !1
                }

                function Vu(t) {
                    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
                    try {
                        return t.activeElement || t.body
                    } catch {
                        return t.body
                    }
                }
                var am = /[\n"\\]/g;

                function xl(t) {
                    return t.replace(am, function(l) {
                        return "\\" + l.charCodeAt(0).toString(16) + " "
                    })
                }

                function xi(t, l, e, a, u, n, i, c) {
                    t.name = "", i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" ? t.type = i : t.removeAttribute("type"), l != null ? i === "number" ? (l === 0 && t.value === "" || t.value != l) && (t.value = "" + Sl(l)) : t.value !== "" + Sl(l) && (t.value = "" + Sl(l)) : i !== "submit" && i !== "reset" || t.removeAttribute("value"), l != null ? Ei(t, i, Sl(l)) : e != null ? Ei(t, i, Sl(e)) : a != null && t.removeAttribute("value"), u == null && n != null && (t.defaultChecked = !!n), u != null && (t.checked = u && typeof u != "function" && typeof u != "symbol"), c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? t.name = "" + Sl(c) : t.removeAttribute("name")
                }

                function oo(t, l, e, a, u, n, i, c) {
                    if (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (t.type = n), l != null || e != null) {
                        if (!(n !== "submit" && n !== "reset" || l != null)) {
                            Si(t);
                            return
                        }
                        e = e != null ? "" + Sl(e) : "", l = l != null ? "" + Sl(l) : e, c || l === t.value || (t.value = l), t.defaultValue = l
                    }
                    a = a ?? u, a = typeof a != "function" && typeof a != "symbol" && !!a, t.checked = c ? t.checked : !!a, t.defaultChecked = !!a, i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (t.name = i), Si(t)
                }

                function Ei(t, l, e) {
                    l === "number" && Vu(t.ownerDocument) === t || t.defaultValue === "" + e || (t.defaultValue = "" + e)
                }

                function ua(t, l, e, a) {
                    if (t = t.options, l) {
                        l = {};
                        for (var u = 0; u < e.length; u++) l["$" + e[u]] = !0;
                        for (e = 0; e < t.length; e++) u = l.hasOwnProperty("$" + t[e].value), t[e].selected !== u && (t[e].selected = u), u && a && (t[e].defaultSelected = !0)
                    } else {
                        for (e = "" + Sl(e), l = null, u = 0; u < t.length; u++) {
                            if (t[u].value === e) {
                                t[u].selected = !0, a && (t[u].defaultSelected = !0);
                                return
                            }
                            l !== null || t[u].disabled || (l = t[u])
                        }
                        l !== null && (l.selected = !0)
                    }
                }

                function so(t, l, e) {
                    if (l != null && (l = "" + Sl(l), l !== t.value && (t.value = l), e == null)) {
                        t.defaultValue !== l && (t.defaultValue = l);
                        return
                    }
                    t.defaultValue = e != null ? "" + Sl(e) : ""
                }

                function ro(t, l, e, a) {
                    if (l == null) {
                        if (a != null) {
                            if (e != null) throw Error(s(92));
                            if (j(a)) {
                                if (1 < a.length) throw Error(s(93));
                                a = a[0]
                            }
                            e = a
                        }
                        e == null && (e = ""), l = e
                    }
                    e = Sl(l), t.defaultValue = e, a = t.textContent, a === e && a !== "" && a !== null && (t.value = a), Si(t)
                }

                function na(t, l) {
                    if (l) {
                        var e = t.firstChild;
                        if (e && e === t.lastChild && e.nodeType === 3) {
                            e.nodeValue = l;
                            return
                        }
                    }
                    t.textContent = l
                }
                var um = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));

                function mo(t, l, e) {
                    var a = l.indexOf("--") === 0;
                    e == null || typeof e == "boolean" || e === "" ? a ? t.setProperty(l, "") : l === "float" ? t.cssFloat = "" : t[l] = "" : a ? t.setProperty(l, e) : typeof e != "number" || e === 0 || um.has(l) ? l === "float" ? t.cssFloat = e : t[l] = ("" + e).trim() : t[l] = e + "px"
                }

                function yo(t, l, e) {
                    if (l != null && typeof l != "object") throw Error(s(62));
                    if (t = t.style, e != null) {
                        for (var a in e) !e.hasOwnProperty(a) || l != null && l.hasOwnProperty(a) || (a.indexOf("--") === 0 ? t.setProperty(a, "") : a === "float" ? t.cssFloat = "" : t[a] = "");
                        for (var u in l) a = l[u], l.hasOwnProperty(u) && e[u] !== a && mo(t, u, a)
                    } else
                        for (var n in l) l.hasOwnProperty(n) && mo(t, n, l[n])
                }

                function zi(t) {
                    if (t.indexOf("-") === -1) return !1;
                    switch (t) {
                        case "annotation-xml":
                        case "color-profile":
                        case "font-face":
                        case "font-face-src":
                        case "font-face-uri":
                        case "font-face-format":
                        case "font-face-name":
                        case "missing-glyph":
                            return !1;
                        default:
                            return !0
                    }
                }
                var nm = new Map([
                    ["acceptCharset", "accept-charset"],
                    ["htmlFor", "for"],
                    ["httpEquiv", "http-equiv"],
                    ["crossOrigin", "crossorigin"],
                    ["accentHeight", "accent-height"],
                    ["alignmentBaseline", "alignment-baseline"],
                    ["arabicForm", "arabic-form"],
                    ["baselineShift", "baseline-shift"],
                    ["capHeight", "cap-height"],
                    ["clipPath", "clip-path"],
                    ["clipRule", "clip-rule"],
                    ["colorInterpolation", "color-interpolation"],
                    ["colorInterpolationFilters", "color-interpolation-filters"],
                    ["colorProfile", "color-profile"],
                    ["colorRendering", "color-rendering"],
                    ["dominantBaseline", "dominant-baseline"],
                    ["enableBackground", "enable-background"],
                    ["fillOpacity", "fill-opacity"],
                    ["fillRule", "fill-rule"],
                    ["floodColor", "flood-color"],
                    ["floodOpacity", "flood-opacity"],
                    ["fontFamily", "font-family"],
                    ["fontSize", "font-size"],
                    ["fontSizeAdjust", "font-size-adjust"],
                    ["fontStretch", "font-stretch"],
                    ["fontStyle", "font-style"],
                    ["fontVariant", "font-variant"],
                    ["fontWeight", "font-weight"],
                    ["glyphName", "glyph-name"],
                    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
                    ["glyphOrientationVertical", "glyph-orientation-vertical"],
                    ["horizAdvX", "horiz-adv-x"],
                    ["horizOriginX", "horiz-origin-x"],
                    ["imageRendering", "image-rendering"],
                    ["letterSpacing", "letter-spacing"],
                    ["lightingColor", "lighting-color"],
                    ["markerEnd", "marker-end"],
                    ["markerMid", "marker-mid"],
                    ["markerStart", "marker-start"],
                    ["overlinePosition", "overline-position"],
                    ["overlineThickness", "overline-thickness"],
                    ["paintOrder", "paint-order"],
                    ["panose-1", "panose-1"],
                    ["pointerEvents", "pointer-events"],
                    ["renderingIntent", "rendering-intent"],
                    ["shapeRendering", "shape-rendering"],
                    ["stopColor", "stop-color"],
                    ["stopOpacity", "stop-opacity"],
                    ["strikethroughPosition", "strikethrough-position"],
                    ["strikethroughThickness", "strikethrough-thickness"],
                    ["strokeDasharray", "stroke-dasharray"],
                    ["strokeDashoffset", "stroke-dashoffset"],
                    ["strokeLinecap", "stroke-linecap"],
                    ["strokeLinejoin", "stroke-linejoin"],
                    ["strokeMiterlimit", "stroke-miterlimit"],
                    ["strokeOpacity", "stroke-opacity"],
                    ["strokeWidth", "stroke-width"],
                    ["textAnchor", "text-anchor"],
                    ["textDecoration", "text-decoration"],
                    ["textRendering", "text-rendering"],
                    ["transformOrigin", "transform-origin"],
                    ["underlinePosition", "underline-position"],
                    ["underlineThickness", "underline-thickness"],
                    ["unicodeBidi", "unicode-bidi"],
                    ["unicodeRange", "unicode-range"],
                    ["unitsPerEm", "units-per-em"],
                    ["vAlphabetic", "v-alphabetic"],
                    ["vHanging", "v-hanging"],
                    ["vIdeographic", "v-ideographic"],
                    ["vMathematical", "v-mathematical"],
                    ["vectorEffect", "vector-effect"],
                    ["vertAdvY", "vert-adv-y"],
                    ["vertOriginX", "vert-origin-x"],
                    ["vertOriginY", "vert-origin-y"],
                    ["wordSpacing", "word-spacing"],
                    ["writingMode", "writing-mode"],
                    ["xmlnsXlink", "xmlns:xlink"],
                    ["xHeight", "x-height"]
                ]),
                    im = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;

                function Ku(t) {
                    return im.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t
                }

                function Xl() {}
                var Ti = null;

                function Ai(t) {
                    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t
                }
                var ia = null,
                    ca = null;

                function ho(t) {
                    var l = la(t);
                    if (l && (t = l.stateNode)) {
                        var e = t[It] || null;
                        t: switch (t = l.stateNode, l.type) {
                            case "input":
                                if (xi(t, e.value, e.defaultValue, e.defaultValue, e.checked, e.defaultChecked, e.type, e.name), l = e.name, e.type === "radio" && l != null) {
                                    for (e = t; e.parentNode;) e = e.parentNode;
                                    for (e = e.querySelectorAll('input[name="' + xl("" + l) + '"][type="radio"]'), l = 0; l < e.length; l++) {
                                        var a = e[l];
                                        if (a !== t && a.form === t.form) {
                                            var u = a[It] || null;
                                            if (!u) throw Error(s(90));
                                            xi(a, u.value, u.defaultValue, u.defaultValue, u.checked, u.defaultChecked, u.type, u.name)
                                        }
                                    }
                                    for (l = 0; l < e.length; l++) a = e[l], a.form === t.form && fo(a)
                                }
                                break t;
                            case "textarea":
                                so(t, e.value, e.defaultValue);
                                break t;
                            case "select":
                                l = e.value, l != null && ua(t, !!e.multiple, l, !1)
                        }
                    }
                }
                var Hi = !1;

                function vo(t, l, e) {
                    if (Hi) return t(l, e);
                    Hi = !0;
                    try {
                        var a = t(l);
                        return a
                    } finally {
                        if (Hi = !1, (ia !== null || ca !== null) && (Cn(), ia && (l = ia, t = ca, ca = ia = null, ho(l), t)))
                            for (l = 0; l < t.length; l++) ho(t[l])
                    }
                }

                function Ka(t, l) {
                    var e = t.stateNode;
                    if (e === null) return null;
                    var a = e[It] || null;
                    if (a === null) return null;
                    e = a[l];
                    t: switch (l) {
                        case "onClick":
                        case "onClickCapture":
                        case "onDoubleClick":
                        case "onDoubleClickCapture":
                        case "onMouseDown":
                        case "onMouseDownCapture":
                        case "onMouseMove":
                        case "onMouseMoveCapture":
                        case "onMouseUp":
                        case "onMouseUpCapture":
                        case "onMouseEnter":
                            (a = !a.disabled) || (t = t.type, a = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !a;
                            break t;
                        default:
                            t = !1
                    }
                    if (t) return null;
                    if (e && typeof e != "function") throw Error(s(231, l, typeof e));
                    return e
                }
                var Ql = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"),
                    Mi = !1;
                if (Ql) try {
                    var Ja = {};
                    Object.defineProperty(Ja, "passive", {
                        get: function() {
                            Mi = !0
                        }
                    }), window.addEventListener("test", Ja, Ja), window.removeEventListener("test", Ja, Ja)
                } catch {
                    Mi = !1
                }
                var ce = null,
                    _i = null,
                    Ju = null;

                function go() {
                    if (Ju) return Ju;
                    var t, l = _i,
                        e = l.length,
                        a, u = "value" in ce ? ce.value : ce.textContent,
                        n = u.length;
                    for (t = 0; t < e && l[t] === u[t]; t++);
                    var i = e - t;
                    for (a = 1; a <= i && l[e - a] === u[n - a]; a++);
                    return Ju = u.slice(t, 1 < a ? 1 - a : void 0)
                }

                function wu(t) {
                    var l = t.keyCode;
                    return "charCode" in t ? (t = t.charCode, t === 0 && l === 13 && (t = 13)) : t = l, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0
                }

                function Wu() {
                    return !0
                }

                function po() {
                    return !1
                }

                function tl(t) {
                    function l(e, a, u, n, i) {
                        this._reactName = e, this._targetInst = u, this.type = a, this.nativeEvent = n, this.target = i, this.currentTarget = null;
                        for (var c in t) t.hasOwnProperty(c) && (e = t[c], this[c] = e ? e(n) : n[c]);
                        return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? Wu : po, this.isPropagationStopped = po, this
                    }
                    return R(l.prototype, {
                        preventDefault: function() {
                            this.defaultPrevented = !0;
                            var e = this.nativeEvent;
                            e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Wu)
                        },
                        stopPropagation: function() {
                            var e = this.nativeEvent;
                            e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Wu)
                        },
                        persist: function() {},
                        isPersistent: Wu
                    }), l
                }
                var Be = {
                    eventPhase: 0,
                    bubbles: 0,
                    cancelable: 0,
                    timeStamp: function(t) {
                        return t.timeStamp || Date.now()
                    },
                    defaultPrevented: 0,
                    isTrusted: 0
                },
                    ku = tl(Be),
                    wa = R({}, Be, {
                        view: 0,
                        detail: 0
                    }),
                    cm = tl(wa),
                    Di, Oi, Wa, $u = R({}, wa, {
                        screenX: 0,
                        screenY: 0,
                        clientX: 0,
                        clientY: 0,
                        pageX: 0,
                        pageY: 0,
                        ctrlKey: 0,
                        shiftKey: 0,
                        altKey: 0,
                        metaKey: 0,
                        getModifierState: ji,
                        button: 0,
                        buttons: 0,
                        relatedTarget: function(t) {
                            return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget
                        },
                        movementX: function(t) {
                            return "movementX" in t ? t.movementX : (t !== Wa && (Wa && t.type === "mousemove" ? (Di = t.screenX - Wa.screenX, Oi = t.screenY - Wa.screenY) : Oi = Di = 0, Wa = t), Di)
                        },
                        movementY: function(t) {
                            return "movementY" in t ? t.movementY : Oi
                        }
                    }),
                    bo = tl($u),
                    fm = R({}, $u, {
                        dataTransfer: 0
                    }),
                    om = tl(fm),
                    sm = R({}, wa, {
                        relatedTarget: 0
                    }),
                    Ui = tl(sm),
                    rm = R({}, Be, {
                        animationName: 0,
                        elapsedTime: 0,
                        pseudoElement: 0
                    }),
                    dm = tl(rm),
                    mm = R({}, Be, {
                        clipboardData: function(t) {
                            return "clipboardData" in t ? t.clipboardData : window.clipboardData
                        }
                    }),
                    ym = tl(mm),
                    hm = R({}, Be, {
                        data: 0
                    }),
                    So = tl(hm),
                    vm = {
                        Esc: "Escape",
                        Spacebar: " ",
                        Left: "ArrowLeft",
                        Up: "ArrowUp",
                        Right: "ArrowRight",
                        Down: "ArrowDown",
                        Del: "Delete",
                        Win: "OS",
                        Menu: "ContextMenu",
                        Apps: "ContextMenu",
                        Scroll: "ScrollLock",
                        MozPrintableKey: "Unidentified"
                    },
                    gm = {
                        8: "Backspace",
                        9: "Tab",
                        12: "Clear",
                        13: "Enter",
                        16: "Shift",
                        17: "Control",
                        18: "Alt",
                        19: "Pause",
                        20: "CapsLock",
                        27: "Escape",
                        32: " ",
                        33: "PageUp",
                        34: "PageDown",
                        35: "End",
                        36: "Home",
                        37: "ArrowLeft",
                        38: "ArrowUp",
                        39: "ArrowRight",
                        40: "ArrowDown",
                        45: "Insert",
                        46: "Delete",
                        112: "F1",
                        113: "F2",
                        114: "F3",
                        115: "F4",
                        116: "F5",
                        117: "F6",
                        118: "F7",
                        119: "F8",
                        120: "F9",
                        121: "F10",
                        122: "F11",
                        123: "F12",
                        144: "NumLock",
                        145: "ScrollLock",
                        224: "Meta"
                    },
                    pm = {
                        Alt: "altKey",
                        Control: "ctrlKey",
                        Meta: "metaKey",
                        Shift: "shiftKey"
                    };

                function bm(t) {
                    var l = this.nativeEvent;
                    return l.getModifierState ? l.getModifierState(t) : (t = pm[t]) ? !!l[t] : !1
                }

                function ji() {
                    return bm
                }
                var Sm = R({}, wa, {
                    key: function(t) {
                        if (t.key) {
                            var l = vm[t.key] || t.key;
                            if (l !== "Unidentified") return l
                        }
                        return t.type === "keypress" ? (t = wu(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? gm[t.keyCode] || "Unidentified" : ""
                    },
                    code: 0,
                    location: 0,
                    ctrlKey: 0,
                    shiftKey: 0,
                    altKey: 0,
                    metaKey: 0,
                    repeat: 0,
                    locale: 0,
                    getModifierState: ji,
                    charCode: function(t) {
                        return t.type === "keypress" ? wu(t) : 0
                    },
                    keyCode: function(t) {
                        return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0
                    },
                    which: function(t) {
                        return t.type === "keypress" ? wu(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0
                    }
                }),
                    xm = tl(Sm),
                    Em = R({}, $u, {
                        pointerId: 0,
                        width: 0,
                        height: 0,
                        pressure: 0,
                        tangentialPressure: 0,
                        tiltX: 0,
                        tiltY: 0,
                        twist: 0,
                        pointerType: 0,
                        isPrimary: 0
                    }),
                    xo = tl(Em),
                    zm = R({}, wa, {
                        touches: 0,
                        targetTouches: 0,
                        changedTouches: 0,
                        altKey: 0,
                        metaKey: 0,
                        ctrlKey: 0,
                        shiftKey: 0,
                        getModifierState: ji
                    }),
                    Tm = tl(zm),
                    Am = R({}, Be, {
                        propertyName: 0,
                        elapsedTime: 0,
                        pseudoElement: 0
                    }),
                    Hm = tl(Am),
                    Mm = R({}, $u, {
                        deltaX: function(t) {
                            return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0
                        },
                        deltaY: function(t) {
                            return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0
                        },
                        deltaZ: 0,
                        deltaMode: 0
                    }),
                    _m = tl(Mm),
                    Dm = R({}, Be, {
                        newState: 0,
                        oldState: 0
                    }),
                    Om = tl(Dm),
                    Um = [9, 13, 27, 32],
                    Ci = Ql && "CompositionEvent" in window,
                    ka = null;
                Ql && "documentMode" in document && (ka = document.documentMode);
                var jm = Ql && "TextEvent" in window && !ka,
                    Eo = Ql && (!Ci || ka && 8 < ka && 11 >= ka),
                    zo = " ",
                    To = !1;

                function Ao(t, l) {
                    switch (t) {
                        case "keyup":
                            return Um.indexOf(l.keyCode) !== -1;
                        case "keydown":
                            return l.keyCode !== 229;
                        case "keypress":
                        case "mousedown":
                        case "focusout":
                            return !0;
                        default:
                            return !1
                    }
                }

                function Ho(t) {
                    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null
                }
                var fa = !1;

                function Cm(t, l) {
                    switch (t) {
                        case "compositionend":
                            return Ho(l);
                        case "keypress":
                            return l.which !== 32 ? null : (To = !0, zo);
                        case "textInput":
                            return t = l.data, t === zo && To ? null : t;
                        default:
                            return null
                    }
                }

                function Bm(t, l) {
                    if (fa) return t === "compositionend" || !Ci && Ao(t, l) ? (t = go(), Ju = _i = ce = null, fa = !1, t) : null;
                    switch (t) {
                        case "paste":
                            return null;
                        case "keypress":
                            if (!(l.ctrlKey || l.altKey || l.metaKey) || l.ctrlKey && l.altKey) {
                                if (l.char && 1 < l.char.length) return l.char;
                                if (l.which) return String.fromCharCode(l.which)
                            }
                            return null;
                        case "compositionend":
                            return Eo && l.locale !== "ko" ? null : l.data;
                        default:
                            return null
                    }
                }
                var Rm = {
                    color: !0,
                    date: !0,
                    datetime: !0,
                    "datetime-local": !0,
                    email: !0,
                    month: !0,
                    number: !0,
                    password: !0,
                    range: !0,
                    search: !0,
                    tel: !0,
                    text: !0,
                    time: !0,
                    url: !0,
                    week: !0
                };

                function Mo(t) {
                    var l = t && t.nodeName && t.nodeName.toLowerCase();
                    return l === "input" ? !!Rm[t.type] : l === "textarea"
                }

                function _o(t, l, e, a) {
                    ia ? ca ? ca.push(a) : ca = [a] : ia = a, l = Xn(l, "onChange"), 0 < l.length && (e = new ku("onChange", "change", null, e, a), t.push({
                        event: e,
                        listeners: l
                    }))
                }
                var $a = null,
                    Fa = null;

                function Nm(t) {
                    sd(t, 0)
                }

                function Fu(t) {
                    var l = Va(t);
                    if (fo(l)) return t
                }

                function Do(t, l) {
                    if (t === "change") return l
                }
                var Oo = !1;
                if (Ql) {
                    var Bi;
                    if (Ql) {
                        var Ri = "oninput" in document;
                        if (!Ri) {
                            var Uo = document.createElement("div");
                            Uo.setAttribute("oninput", "return;"), Ri = typeof Uo.oninput == "function"
                        }
                        Bi = Ri
                    } else Bi = !1;
                    Oo = Bi && (!document.documentMode || 9 < document.documentMode)
                }

                function jo() {
                    $a && ($a.detachEvent("onpropertychange", Co), Fa = $a = null)
                }

                function Co(t) {
                    if (t.propertyName === "value" && Fu(Fa)) {
                        var l = [];
                        _o(l, Fa, t, Ai(t)), vo(Nm, l)
                    }
                }

                function qm(t, l, e) {
                    t === "focusin" ? (jo(), $a = l, Fa = e, $a.attachEvent("onpropertychange", Co)) : t === "focusout" && jo()
                }

                function Ym(t) {
                    if (t === "selectionchange" || t === "keyup" || t === "keydown") return Fu(Fa)
                }

                function Gm(t, l) {
                    if (t === "click") return Fu(l)
                }

                function Xm(t, l) {
                    if (t === "input" || t === "change") return Fu(l)
                }

                function Qm(t, l) {
                    return t === l && (t !== 0 || 1 / t === 1 / l) || t !== t && l !== l
                }
                var sl = typeof Object.is == "function" ? Object.is : Qm;

                function Pa(t, l) {
                    if (sl(t, l)) return !0;
                    if (typeof t != "object" || t === null || typeof l != "object" || l === null) return !1;
                    var e = Object.keys(t),
                        a = Object.keys(l);
                    if (e.length !== a.length) return !1;
                    for (a = 0; a < e.length; a++) {
                        var u = e[a];
                        if (!di.call(l, u) || !sl(t[u], l[u])) return !1
                    }
                    return !0
                }

                function Bo(t) {
                    for (; t && t.firstChild;) t = t.firstChild;
                    return t
                }

                function Ro(t, l) {
                    var e = Bo(t);
                    t = 0;
                    for (var a; e;) {
                        if (e.nodeType === 3) {
                            if (a = t + e.textContent.length, t <= l && a >= l) return {
                                node: e,
                                offset: l - t
                            };
                            t = a
                        }
                        t: {
                            for (; e;) {
                                if (e.nextSibling) {
                                    e = e.nextSibling;
                                    break t
                                }
                                e = e.parentNode
                            }
                            e = void 0
                        }
                        e = Bo(e)
                    }
                }

                function No(t, l) {
                    return t && l ? t === l ? !0 : t && t.nodeType === 3 ? !1 : l && l.nodeType === 3 ? No(t, l.parentNode) : "contains" in t ? t.contains(l) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(l) & 16) : !1 : !1
                }

                function qo(t) {
                    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
                    for (var l = Vu(t.document); l instanceof t.HTMLIFrameElement;) {
                        try {
                            var e = typeof l.contentWindow.location.href == "string"
                            } catch {
                                e = !1
                            }
                        if (e) t = l.contentWindow;
                        else break;
                        l = Vu(t.document)
                    }
                    return l
                }

                function Ni(t) {
                    var l = t && t.nodeName && t.nodeName.toLowerCase();
                    return l && (l === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || l === "textarea" || t.contentEditable === "true")
                }
                var Zm = Ql && "documentMode" in document && 11 >= document.documentMode,
                    oa = null,
                    qi = null,
                    Ia = null,
                    Yi = !1;

                function Yo(t, l, e) {
                    var a = e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
                    Yi || oa == null || oa !== Vu(a) || (a = oa, "selectionStart" in a && Ni(a) ? a = {
                        start: a.selectionStart,
                        end: a.selectionEnd
                    } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
                        anchorNode: a.anchorNode,
                        anchorOffset: a.anchorOffset,
                        focusNode: a.focusNode,
                        focusOffset: a.focusOffset
                    }), Ia && Pa(Ia, a) || (Ia = a, a = Xn(qi, "onSelect"), 0 < a.length && (l = new ku("onSelect", "select", null, l, e), t.push({
                        event: l,
                        listeners: a
                    }), l.target = oa)))
                }

                function Re(t, l) {
                    var e = {};
                    return e[t.toLowerCase()] = l.toLowerCase(), e["Webkit" + t] = "webkit" + l, e["Moz" + t] = "moz" + l, e
                }
                var sa = {
                    animationend: Re("Animation", "AnimationEnd"),
                    animationiteration: Re("Animation", "AnimationIteration"),
                    animationstart: Re("Animation", "AnimationStart"),
                    transitionrun: Re("Transition", "TransitionRun"),
                    transitionstart: Re("Transition", "TransitionStart"),
                    transitioncancel: Re("Transition", "TransitionCancel"),
                    transitionend: Re("Transition", "TransitionEnd")
                },
                    Gi = {},
                    Go = {};
                Ql && (Go = document.createElement("div").style, "AnimationEvent" in window || (delete sa.animationend.animation, delete sa.animationiteration.animation, delete sa.animationstart.animation), "TransitionEvent" in window || delete sa.transitionend.transition);

                function Ne(t) {
                    if (Gi[t]) return Gi[t];
                    if (!sa[t]) return t;
                    var l = sa[t],
                        e;
                    for (e in l)
                        if (l.hasOwnProperty(e) && e in Go) return Gi[t] = l[e];
                    return t
                }
                var Xo = Ne("animationend"),
                    Qo = Ne("animationiteration"),
                    Zo = Ne("animationstart"),
                    Lm = Ne("transitionrun"),
                    Vm = Ne("transitionstart"),
                    Km = Ne("transitioncancel"),
                    Lo = Ne("transitionend"),
                    Vo = new Map,
                    Xi = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
                Xi.push("scrollEnd");

                function Ul(t, l) {
                    Vo.set(t, l), Ce(l, [t])
                }
                var Pu = typeof reportError == "function" ? reportError : function(t) {
                    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
                        var l = new window.ErrorEvent("error", {
                            bubbles: !0,
                            cancelable: !0,
                            message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
                            error: t
                        });
                        if (!window.dispatchEvent(l)) return
                    } else if (typeof f == "object" && typeof f.emit == "function") {
                        f.emit("uncaughtException", t);
                        return
                    }
                    console.error(t)
                },
                    El = [],
                    ra = 0,
                    Qi = 0;

                function Iu() {
                    for (var t = ra, l = Qi = ra = 0; l < t;) {
                        var e = El[l];
                        El[l++] = null;
                        var a = El[l];
                        El[l++] = null;
                        var u = El[l];
                        El[l++] = null;
                        var n = El[l];
                        if (El[l++] = null, a !== null && u !== null) {
                            var i = a.pending;
                            i === null ? u.next = u : (u.next = i.next, i.next = u), a.pending = u
                        }
                        n !== 0 && Ko(e, u, n)
                    }
                }

                function tn(t, l, e, a) {
                    El[ra++] = t, El[ra++] = l, El[ra++] = e, El[ra++] = a, Qi |= a, t.lanes |= a, t = t.alternate, t !== null && (t.lanes |= a)
                }

                function Zi(t, l, e, a) {
                    return tn(t, l, e, a), ln(t)
                }

                function qe(t, l) {
                    return tn(t, null, null, l), ln(t)
                }

                function Ko(t, l, e) {
                    t.lanes |= e;
                    var a = t.alternate;
                    a !== null && (a.lanes |= e);
                    for (var u = !1, n = t.return; n !== null;) n.childLanes |= e, a = n.alternate, a !== null && (a.childLanes |= e), n.tag === 22 && (t = n.stateNode, t === null || t._visibility & 1 || (u = !0)), t = n, n = n.return;
                    return t.tag === 3 ? (n = t.stateNode, u && l !== null && (u = 31 - ol(e), t = n.hiddenUpdates, a = t[u], a === null ? t[u] = [l] : a.push(l), l.lane = e | 536870912), n) : null
                }

                function ln(t) {
                    if (50 < xu) throw xu = 0, Fc = null, Error(s(185));
                    for (var l = t.return; l !== null;) t = l, l = t.return;
                    return t.tag === 3 ? t.stateNode : null
                }
                var da = {};

                function Jm(t, l, e, a) {
                    this.tag = t, this.key = e, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = l, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null
                }

                function rl(t, l, e, a) {
                    return new Jm(t, l, e, a)
                }

                function Li(t) {
                    return t = t.prototype, !(!t || !t.isReactComponent)
                }

                function Zl(t, l) {
                    var e = t.alternate;
                    return e === null ? (e = rl(t.tag, l, t.key, t.mode), e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.alternate = t, t.alternate = e) : (e.pendingProps = l, e.type = t.type, e.flags = 0, e.subtreeFlags = 0, e.deletions = null), e.flags = t.flags & 65011712, e.childLanes = t.childLanes, e.lanes = t.lanes, e.child = t.child, e.memoizedProps = t.memoizedProps, e.memoizedState = t.memoizedState, e.updateQueue = t.updateQueue, l = t.dependencies, e.dependencies = l === null ? null : {
                        lanes: l.lanes,
                        firstContext: l.firstContext
                    }, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.refCleanup = t.refCleanup, e
                }

                function Jo(t, l) {
                    t.flags &= 65011714;
                    var e = t.alternate;
                    return e === null ? (t.childLanes = 0, t.lanes = l, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = e.childLanes, t.lanes = e.lanes, t.child = e.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = e.memoizedProps, t.memoizedState = e.memoizedState, t.updateQueue = e.updateQueue, t.type = e.type, l = e.dependencies, t.dependencies = l === null ? null : {
                        lanes: l.lanes,
                        firstContext: l.firstContext
                    }), t
                }

                function en(t, l, e, a, u, n) {
                    var i = 0;
                    if (a = t, typeof t == "function") Li(t) && (i = 1);
                    else if (typeof t == "string") i = Fy(t, e, N.current) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
                    else t: switch (t) {
                        case bl:
                            return t = rl(31, e, l, u), t.elementType = bl, t.lanes = n, t;
                        case xt:
                            return Ye(e.children, u, n, l);
                        case Vt:
                            i = 8, u |= 24;
                            break;
                        case Ct:
                            return t = rl(12, e, l, u | 2), t.elementType = Ct, t.lanes = n, t;
                        case Jt:
                            return t = rl(13, e, l, u), t.elementType = Jt, t.lanes = n, t;
                        case Nt:
                            return t = rl(19, e, l, u), t.elementType = Nt, t.lanes = n, t;
                        default:
                            if (typeof t == "object" && t !== null) switch (t.$$typeof) {
                                case Mt:
                                    i = 10;
                                    break t;
                                case pl:
                                    i = 9;
                                    break t;
                                case Kt:
                                    i = 11;
                                    break t;
                                case P:
                                    i = 14;
                                    break t;
                                case qt:
                                    i = 16, a = null;
                                    break t
                            }
                            i = 29, e = Error(s(130, t === null ? "null" : typeof t, "")), a = null
                    }
                    return l = rl(i, e, l, u), l.elementType = t, l.type = a, l.lanes = n, l
                }

                function Ye(t, l, e, a) {
                    return t = rl(7, t, a, l), t.lanes = e, t
                }

                function Vi(t, l, e) {
                    return t = rl(6, t, null, l), t.lanes = e, t
                }

                function wo(t) {
                    var l = rl(18, null, null, 0);
                    return l.stateNode = t, l
                }

                function Ki(t, l, e) {
                    return l = rl(4, t.children !== null ? t.children : [], t.key, l), l.lanes = e, l.stateNode = {
                        containerInfo: t.containerInfo,
                        pendingChildren: null,
                        implementation: t.implementation
                    }, l
                }
                var Wo = new WeakMap;

                function zl(t, l) {
                    if (typeof t == "object" && t !== null) {
                        var e = Wo.get(t);
                        return e !== void 0 ? e : (l = {
                            value: t,
                            source: l,
                            stack: Jf(l)
                        }, Wo.set(t, l), l)
                    }
                    return {
                        value: t,
                        source: l,
                        stack: Jf(l)
                    }
                }
                var ma = [],
                    ya = 0,
                    an = null,
                    tu = 0,
                    Tl = [],
                    Al = 0,
                    fe = null,
                    Bl = 1,
                    Rl = "";

                function Ll(t, l) {
                    ma[ya++] = tu, ma[ya++] = an, an = t, tu = l
                }

                function ko(t, l, e) {
                    Tl[Al++] = Bl, Tl[Al++] = Rl, Tl[Al++] = fe, fe = t;
                    var a = Bl;
                    t = Rl;
                    var u = 32 - ol(a) - 1;
                    a &= ~(1 << u), e += 1;
                    var n = 32 - ol(l) + u;
                    if (30 < n) {
                        var i = u - u % 5;
                        n = (a & (1 << i) - 1).toString(32), a >>= i, u -= i, Bl = 1 << 32 - ol(l) + u | e << u | a, Rl = n + t
                    } else Bl = 1 << n | e << u | a, Rl = t
                }

                function Ji(t) {
                    t.return !== null && (Ll(t, 1), ko(t, 1, 0))
                }

                function wi(t) {
                    for (; t === an;) an = ma[--ya], ma[ya] = null, tu = ma[--ya], ma[ya] = null;
                    for (; t === fe;) fe = Tl[--Al], Tl[Al] = null, Rl = Tl[--Al], Tl[Al] = null, Bl = Tl[--Al], Tl[Al] = null
                }

                function $o(t, l) {
                    Tl[Al++] = Bl, Tl[Al++] = Rl, Tl[Al++] = fe, Bl = l.id, Rl = l.overflow, fe = t
                }
                var Gt = null,
                    ht = null,
                    lt = !1,
                    oe = null,
                    Hl = !1,
                    Wi = Error(s(519));

                function se(t) {
                    var l = Error(s(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
                    throw lu(zl(l, t)), Wi
                }

                function Fo(t) {
                    var l = t.stateNode,
                        e = t.type,
                        a = t.memoizedProps;
                    switch (l[Yt] = t, l[It] = a, e) {
                        case "dialog":
                            F("cancel", l), F("close", l);
                            break;
                        case "iframe":
                        case "object":
                        case "embed":
                            F("load", l);
                            break;
                        case "video":
                        case "audio":
                            for (e = 0; e < zu.length; e++) F(zu[e], l);
                            break;
                        case "source":
                            F("error", l);
                            break;
                        case "img":
                        case "image":
                        case "link":
                            F("error", l), F("load", l);
                            break;
                        case "details":
                            F("toggle", l);
                            break;
                        case "input":
                            F("invalid", l), oo(l, a.value, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name, !0);
                            break;
                        case "select":
                            F("invalid", l);
                            break;
                        case "textarea":
                            F("invalid", l), ro(l, a.value, a.defaultValue, a.children)
                    }
                    e = a.children, typeof e != "string" && typeof e != "number" && typeof e != "bigint" || l.textContent === "" + e || a.suppressHydrationWarning === !0 || yd(l.textContent, e) ? (a.popover != null && (F("beforetoggle", l), F("toggle", l)), a.onScroll != null && F("scroll", l), a.onScrollEnd != null && F("scrollend", l), a.onClick != null && (l.onclick = Xl), l = !0) : l = !1, l || se(t, !0)
                }

                function Po(t) {
                    for (Gt = t.return; Gt;) switch (Gt.tag) {
                        case 5:
                        case 31:
                        case 13:
                            Hl = !1;
                            return;
                        case 27:
                        case 3:
                            Hl = !0;
                            return;
                        default:
                            Gt = Gt.return
                    }
                }

                function ha(t) {
                    if (t !== Gt) return !1;
                    if (!lt) return Po(t), lt = !0, !1;
                    var l = t.tag,
                        e;
                    if ((e = l !== 3 && l !== 27) && ((e = l === 5) && (e = t.type, e = !(e !== "form" && e !== "button") || mf(t.type, t.memoizedProps)), e = !e), e && ht && se(t), Po(t), l === 13) {
                        if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(s(317));
                        ht = zd(t)
                    } else if (l === 31) {
                        if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(s(317));
                        ht = zd(t)
                    } else l === 27 ? (l = ht, Te(t.type) ? (t = pf, pf = null, ht = t) : ht = l) : ht = Gt ? _l(t.stateNode.nextSibling) : null;
                    return !0
                }

                function Ge() {
                    ht = Gt = null, lt = !1
                }

                function ki() {
                    var t = oe;
                    return t !== null && (ul === null ? ul = t : ul.push.apply(ul, t), oe = null), t
                }

                function lu(t) {
                    oe === null ? oe = [t] : oe.push(t)
                }
                var $i = r(null),
                    Xe = null,
                    Vl = null;

                function re(t, l, e) {
                    _($i, l._currentValue), l._currentValue = e
                }

                function Kl(t) {
                    t._currentValue = $i.current, T($i)
                }

                function Fi(t, l, e) {
                    for (; t !== null;) {
                        var a = t.alternate;
                        if ((t.childLanes & l) !== l ? (t.childLanes |= l, a !== null && (a.childLanes |= l)) : a !== null && (a.childLanes & l) !== l && (a.childLanes |= l), t === e) break;
                        t = t.return
                    }
                }

                function Pi(t, l, e, a) {
                    var u = t.child;
                    for (u !== null && (u.return = t); u !== null;) {
                        var n = u.dependencies;
                        if (n !== null) {
                            var i = u.child;
                            n = n.firstContext;
                            t: for (; n !== null;) {
                                var c = n;
                                n = u;
                                for (var o = 0; o < l.length; o++)
                                    if (c.context === l[o]) {
                                        n.lanes |= e, c = n.alternate, c !== null && (c.lanes |= e), Fi(n.return, e, t), a || (i = null);
                                        break t
                                    } n = c.next
                            }
                        } else if (u.tag === 18) {
                            if (i = u.return, i === null) throw Error(s(341));
                            i.lanes |= e, n = i.alternate, n !== null && (n.lanes |= e), Fi(i, e, t), i = null
                        } else i = u.child;
                        if (i !== null) i.return = u;
                        else
                            for (i = u; i !== null;) {
                                if (i === t) {
                                    i = null;
                                    break
                                }
                                if (u = i.sibling, u !== null) {
                                    u.return = i.return, i = u;
                                    break
                                }
                                i = i.return
                            }
                        u = i
                    }
                }

                function va(t, l, e, a) {
                    t = null;
                    for (var u = l, n = !1; u !== null;) {
                        if (!n) {
                            if ((u.flags & 524288) !== 0) n = !0;
                            else if ((u.flags & 262144) !== 0) break
                        }
                        if (u.tag === 10) {
                            var i = u.alternate;
                            if (i === null) throw Error(s(387));
                            if (i = i.memoizedProps, i !== null) {
                                var c = u.type;
                                sl(u.pendingProps.value, i.value) || (t !== null ? t.push(c) : t = [c])
                            }
                        } else if (u === ct.current) {
                            if (i = u.alternate, i === null) throw Error(s(387));
                            i.memoizedState.memoizedState !== u.memoizedState.memoizedState && (t !== null ? t.push(_u) : t = [_u])
                        }
                        u = u.return
                    }
                    t !== null && Pi(l, t, e, a), l.flags |= 262144
                }

                function un(t) {
                    for (t = t.firstContext; t !== null;) {
                        if (!sl(t.context._currentValue, t.memoizedValue)) return !0;
                        t = t.next
                    }
                    return !1
                }

                function Qe(t) {
                    Xe = t, Vl = null, t = t.dependencies, t !== null && (t.firstContext = null)
                }

                function Xt(t) {
                    return Io(Xe, t)
                }

                function nn(t, l) {
                    return Xe === null && Qe(t), Io(t, l)
                }

                function Io(t, l) {
                    var e = l._currentValue;
                    if (l = {
                        context: l,
                        memoizedValue: e,
                        next: null
                    }, Vl === null) {
                        if (t === null) throw Error(s(308));
                        Vl = l, t.dependencies = {
                            lanes: 0,
                            firstContext: l
                        }, t.flags |= 524288
                    } else Vl = Vl.next = l;
                    return e
                }
                var wm = typeof AbortController < "u" ? AbortController : function() {
                    var t = [],
                        l = this.signal = {
                            aborted: !1,
                            addEventListener: function(e, a) {
                                t.push(a)
                            }
                        };
                    this.abort = function() {
                        l.aborted = !0, t.forEach(function(e) {
                            return e()
                        })
                    }
                },
                    Wm = d.unstable_scheduleCallback,
                    km = d.unstable_NormalPriority,
                    _t = {
                        $$typeof: Mt,
                        Consumer: null,
                        Provider: null,
                        _currentValue: null,
                        _currentValue2: null,
                        _threadCount: 0
                    };

                function Ii() {
                    return {
                        controller: new wm,
                        data: new Map,
                        refCount: 0
                    }
                }

                function eu(t) {
                    t.refCount--, t.refCount === 0 && Wm(km, function() {
                        t.controller.abort()
                    })
                }
                var au = null,
                    tc = 0,
                    ga = 0,
                    pa = null;

                function $m(t, l) {
                    if (au === null) {
                        var e = au = [];
                        tc = 0, ga = af(), pa = {
                            status: "pending",
                            value: void 0,
                            then: function(a) {
                                e.push(a)
                            }
                        }
                    }
                    return tc++, l.then(ts, ts), l
                }

                function ts() {
                    if (--tc === 0 && au !== null) {
                        pa !== null && (pa.status = "fulfilled");
                        var t = au;
                        au = null, ga = 0, pa = null;
                        for (var l = 0; l < t.length; l++)(0, t[l])()
                    }
                }

                function Fm(t, l) {
                    var e = [],
                        a = {
                            status: "pending",
                            value: null,
                            reason: null,
                            then: function(u) {
                                e.push(u)
                            }
                        };
                    return t.then(function() {
                        a.status = "fulfilled", a.value = l;
                        for (var u = 0; u < e.length; u++)(0, e[u])(l)
                    }, function(u) {
                        for (a.status = "rejected", a.reason = u, u = 0; u < e.length; u++)(0, e[u])(void 0)
                    }), a
                }
                var ls = M.S;
                M.S = function(t, l) {
                    Yr = cl(), typeof l == "object" && l !== null && typeof l.then == "function" && $m(t, l), ls !== null && ls(t, l)
                };
                var Ze = r(null);

                function lc() {
                    var t = Ze.current;
                    return t !== null ? t : yt.pooledCache
                }

                function cn(t, l) {
                    l === null ? _(Ze, Ze.current) : _(Ze, l.pool)
                }

                function es() {
                    var t = lc();
                    return t === null ? null : {
                        parent: _t._currentValue,
                        pool: t
                    }
                }
                var ba = Error(s(460)),
                    ec = Error(s(474)),
                    fn = Error(s(542)),
                    on = {
                        then: function() {}
                    };

                function as(t) {
                    return t = t.status, t === "fulfilled" || t === "rejected"
                }

                function us(t, l, e) {
                    switch (e = t[e], e === void 0 ? t.push(l) : e !== l && (l.then(Xl, Xl), l = e), l.status) {
                        case "fulfilled":
                            return l.value;
                        case "rejected":
                            throw t = l.reason, is(t), t;
                        default:
                            if (typeof l.status == "string") l.then(Xl, Xl);
                            else {
                                if (t = yt, t !== null && 100 < t.shellSuspendCounter) throw Error(s(482));
                                t = l, t.status = "pending", t.then(function(a) {
                                    if (l.status === "pending") {
                                        var u = l;
                                        u.status = "fulfilled", u.value = a
                                    }
                                }, function(a) {
                                    if (l.status === "pending") {
                                        var u = l;
                                        u.status = "rejected", u.reason = a
                                    }
                                })
                            }
                            switch (l.status) {
                                case "fulfilled":
                                    return l.value;
                                case "rejected":
                                    throw t = l.reason, is(t), t
                            }
                            throw Ve = l, ba
                    }
                }

                function Le(t) {
                    try {
                        var l = t._init;
                        return l(t._payload)
                    } catch (e) {
                        throw e !== null && typeof e == "object" && typeof e.then == "function" ? (Ve = e, ba) : e
                    }
                }
                var Ve = null;

                function ns() {
                    if (Ve === null) throw Error(s(459));
                    var t = Ve;
                    return Ve = null, t
                }

                function is(t) {
                    if (t === ba || t === fn) throw Error(s(483))
                }
                var Sa = null,
                    uu = 0;

                function sn(t) {
                    var l = uu;
                    return uu += 1, Sa === null && (Sa = []), us(Sa, t, l)
                }

                function nu(t, l) {
                    l = l.props.ref, t.ref = l !== void 0 ? l : null
                }

                function rn(t, l) {
                    throw l.$$typeof === St ? Error(s(525)) : (t = Object.prototype.toString.call(l), Error(s(31, t === "[object Object]" ? "object with keys {" + Object.keys(l).join(", ") + "}" : t)))
                }

                function cs(t) {
                    function l(y, m) {
                        if (t) {
                            var h = y.deletions;
                            h === null ? (y.deletions = [m], y.flags |= 16) : h.push(m)
                        }
                    }

                    function e(y, m) {
                        if (!t) return null;
                        for (; m !== null;) l(y, m), m = m.sibling;
                        return null
                    }

                    function a(y) {
                        for (var m = new Map; y !== null;) y.key !== null ? m.set(y.key, y) : m.set(y.index, y), y = y.sibling;
                        return m
                    }

                    function u(y, m) {
                        return y = Zl(y, m), y.index = 0, y.sibling = null, y
                    }

                    function n(y, m, h) {
                        return y.index = h, t ? (h = y.alternate, h !== null ? (h = h.index, h < m ? (y.flags |= 67108866, m) : h) : (y.flags |= 67108866, m)) : (y.flags |= 1048576, m)
                    }

                    function i(y) {
                        return t && y.alternate === null && (y.flags |= 67108866), y
                    }

                    function c(y, m, h, A) {
                        return m === null || m.tag !== 6 ? (m = Vi(h, y.mode, A), m.return = y, m) : (m = u(m, h), m.return = y, m)
                    }

                    function o(y, m, h, A) {
                        var X = h.type;
                        return X === xt ? z(y, m, h.props.children, A, h.key) : m !== null && (m.elementType === X || typeof X == "object" && X !== null && X.$$typeof === qt && Le(X) === m.type) ? (m = u(m, h.props), nu(m, h), m.return = y, m) : (m = en(h.type, h.key, h.props, null, y.mode, A), nu(m, h), m.return = y, m)
                    }

                    function v(y, m, h, A) {
                        return m === null || m.tag !== 4 || m.stateNode.containerInfo !== h.containerInfo || m.stateNode.implementation !== h.implementation ? (m = Ki(h, y.mode, A), m.return = y, m) : (m = u(m, h.children || []), m.return = y, m)
                    }

                    function z(y, m, h, A, X) {
                        return m === null || m.tag !== 7 ? (m = Ye(h, y.mode, A, X), m.return = y, m) : (m = u(m, h), m.return = y, m)
                    }

                    function H(y, m, h) {
                        if (typeof m == "string" && m !== "" || typeof m == "number" || typeof m == "bigint") return m = Vi("" + m, y.mode, h), m.return = y, m;
                        if (typeof m == "object" && m !== null) {
                            switch (m.$$typeof) {
                                case V:
                                    return h = en(m.type, m.key, m.props, null, y.mode, h), nu(h, m), h.return = y, h;
                                case nt:
                                    return m = Ki(m, y.mode, h), m.return = y, m;
                                case qt:
                                    return m = Le(m), H(y, m, h)
                            }
                            if (j(m) || Pt(m)) return m = Ye(m, y.mode, h, null), m.return = y, m;
                            if (typeof m.then == "function") return H(y, sn(m), h);
                            if (m.$$typeof === Mt) return H(y, nn(y, m), h);
                            rn(y, m)
                        }
                        return null
                    }

                    function g(y, m, h, A) {
                        var X = m !== null ? m.key : null;
                        if (typeof h == "string" && h !== "" || typeof h == "number" || typeof h == "bigint") return X !== null ? null : c(y, m, "" + h, A);
                        if (typeof h == "object" && h !== null) {
                            switch (h.$$typeof) {
                                case V:
                                    return h.key === X ? o(y, m, h, A) : null;
                                case nt:
                                    return h.key === X ? v(y, m, h, A) : null;
                                case qt:
                                    return h = Le(h), g(y, m, h, A)
                            }
                            if (j(h) || Pt(h)) return X !== null ? null : z(y, m, h, A, null);
                            if (typeof h.then == "function") return g(y, m, sn(h), A);
                            if (h.$$typeof === Mt) return g(y, m, nn(y, h), A);
                            rn(y, h)
                        }
                        return null
                    }

                    function x(y, m, h, A, X) {
                        if (typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint") return y = y.get(h) || null, c(m, y, "" + A, X);
                        if (typeof A == "object" && A !== null) {
                            switch (A.$$typeof) {
                                case V:
                                    return y = y.get(A.key === null ? h : A.key) || null, o(m, y, A, X);
                                case nt:
                                    return y = y.get(A.key === null ? h : A.key) || null, v(m, y, A, X);
                                case qt:
                                    return A = Le(A), x(y, m, h, A, X)
                            }
                            if (j(A) || Pt(A)) return y = y.get(h) || null, z(m, y, A, X, null);
                            if (typeof A.then == "function") return x(y, m, h, sn(A), X);
                            if (A.$$typeof === Mt) return x(y, m, h, nn(m, A), X);
                            rn(m, A)
                        }
                        return null
                    }

                    function B(y, m, h, A) {
                        for (var X = null, at = null, q = m, w = m = 0, tt = null; q !== null && w < h.length; w++) {
                            q.index > w ? (tt = q, q = null) : tt = q.sibling;
                            var ut = g(y, q, h[w], A);
                            if (ut === null) {
                                q === null && (q = tt);
                                break
                            }
                            t && q && ut.alternate === null && l(y, q), m = n(ut, m, w), at === null ? X = ut : at.sibling = ut, at = ut, q = tt
                        }
                        if (w === h.length) return e(y, q), lt && Ll(y, w), X;
                        if (q === null) {
                            for (; w < h.length; w++) q = H(y, h[w], A), q !== null && (m = n(q, m, w), at === null ? X = q : at.sibling = q, at = q);
                            return lt && Ll(y, w), X
                        }
                        for (q = a(q); w < h.length; w++) tt = x(q, y, w, h[w], A), tt !== null && (t && tt.alternate !== null && q.delete(tt.key === null ? w : tt.key), m = n(tt, m, w), at === null ? X = tt : at.sibling = tt, at = tt);
                        return t && q.forEach(function(De) {
                            return l(y, De)
                        }), lt && Ll(y, w), X
                    }

                    function Q(y, m, h, A) {
                        if (h == null) throw Error(s(151));
                        for (var X = null, at = null, q = m, w = m = 0, tt = null, ut = h.next(); q !== null && !ut.done; w++, ut = h.next()) {
                            q.index > w ? (tt = q, q = null) : tt = q.sibling;
                            var De = g(y, q, ut.value, A);
                            if (De === null) {
                                q === null && (q = tt);
                                break
                            }
                            t && q && De.alternate === null && l(y, q), m = n(De, m, w), at === null ? X = De : at.sibling = De, at = De, q = tt
                        }
                        if (ut.done) return e(y, q), lt && Ll(y, w), X;
                        if (q === null) {
                            for (; !ut.done; w++, ut = h.next()) ut = H(y, ut.value, A), ut !== null && (m = n(ut, m, w), at === null ? X = ut : at.sibling = ut, at = ut);
                            return lt && Ll(y, w), X
                        }
                        for (q = a(q); !ut.done; w++, ut = h.next()) ut = x(q, y, w, ut.value, A), ut !== null && (t && ut.alternate !== null && q.delete(ut.key === null ? w : ut.key), m = n(ut, m, w), at === null ? X = ut : at.sibling = ut, at = ut);
                        return t && q.forEach(function(fh) {
                            return l(y, fh)
                        }), lt && Ll(y, w), X
                    }

                    function dt(y, m, h, A) {
                        if (typeof h == "object" && h !== null && h.type === xt && h.key === null && (h = h.props.children), typeof h == "object" && h !== null) {
                            switch (h.$$typeof) {
                                case V:
                                    t: {
                                        for (var X = h.key; m !== null;) {
                                            if (m.key === X) {
                                                if (X = h.type, X === xt) {
                                                    if (m.tag === 7) {
                                                        e(y, m.sibling), A = u(m, h.props.children), A.return = y, y = A;
                                                        break t
                                                    }
                                                } else if (m.elementType === X || typeof X == "object" && X !== null && X.$$typeof === qt && Le(X) === m.type) {
                                                    e(y, m.sibling), A = u(m, h.props), nu(A, h), A.return = y, y = A;
                                                    break t
                                                }
                                                e(y, m);
                                                break
                                            } else l(y, m);
                                            m = m.sibling
                                        }
                                        h.type === xt ? (A = Ye(h.props.children, y.mode, A, h.key), A.return = y, y = A) : (A = en(h.type, h.key, h.props, null, y.mode, A), nu(A, h), A.return = y, y = A)
                                    }
                                    return i(y);
                                case nt:
                                    t: {
                                        for (X = h.key; m !== null;) {
                                            if (m.key === X)
                                                if (m.tag === 4 && m.stateNode.containerInfo === h.containerInfo && m.stateNode.implementation === h.implementation) {
                                                    e(y, m.sibling), A = u(m, h.children || []), A.return = y, y = A;
                                                    break t
                                                } else {
                                                    e(y, m);
                                                    break
                                                }
                                            else l(y, m);
                                            m = m.sibling
                                        }
                                        A = Ki(h, y.mode, A),
                                            A.return = y,
                                            y = A
                                    }
                                    return i(y);
                                case qt:
                                    return h = Le(h), dt(y, m, h, A)
                            }
                            if (j(h)) return B(y, m, h, A);
                            if (Pt(h)) {
                                if (X = Pt(h), typeof X != "function") throw Error(s(150));
                                return h = X.call(h), Q(y, m, h, A)
                            }
                            if (typeof h.then == "function") return dt(y, m, sn(h), A);
                            if (h.$$typeof === Mt) return dt(y, m, nn(y, h), A);
                            rn(y, h)
                        }
                        return typeof h == "string" && h !== "" || typeof h == "number" || typeof h == "bigint" ? (h = "" + h, m !== null && m.tag === 6 ? (e(y, m.sibling), A = u(m, h), A.return = y, y = A) : (e(y, m), A = Vi(h, y.mode, A), A.return = y, y = A), i(y)) : e(y, m)
                    }
                    return function(y, m, h, A) {
                        try {
                            uu = 0;
                            var X = dt(y, m, h, A);
                            return Sa = null, X
                        } catch (q) {
                            if (q === ba || q === fn) throw q;
                            var at = rl(29, q, null, y.mode);
                            return at.lanes = A, at.return = y, at
                        }
                    }
                }
                var Ke = cs(!0),
                    fs = cs(!1),
                    de = !1;

                function ac(t) {
                    t.updateQueue = {
                        baseState: t.memoizedState,
                        firstBaseUpdate: null,
                        lastBaseUpdate: null,
                        shared: {
                            pending: null,
                            lanes: 0,
                            hiddenCallbacks: null
                        },
                        callbacks: null
                    }
                }

                function uc(t, l) {
                    t = t.updateQueue, l.updateQueue === t && (l.updateQueue = {
                        baseState: t.baseState,
                        firstBaseUpdate: t.firstBaseUpdate,
                        lastBaseUpdate: t.lastBaseUpdate,
                        shared: t.shared,
                        callbacks: null
                    })
                }

                function me(t) {
                    return {
                        lane: t,
                        tag: 0,
                        payload: null,
                        callback: null,
                        next: null
                    }
                }

                function ye(t, l, e) {
                    var a = t.updateQueue;
                    if (a === null) return null;
                    if (a = a.shared, (it & 2) !== 0) {
                        var u = a.pending;
                        return u === null ? l.next = l : (l.next = u.next, u.next = l), a.pending = l, l = ln(t), Ko(t, null, e), l
                    }
                    return tn(t, a, l, e), ln(t)
                }

                function iu(t, l, e) {
                    if (l = l.updateQueue, l !== null && (l = l.shared, (e & 4194048) !== 0)) {
                        var a = l.lanes;
                        a &= t.pendingLanes, e |= a, l.lanes = e, Pf(t, e)
                    }
                }

                function nc(t, l) {
                    var e = t.updateQueue,
                        a = t.alternate;
                    if (a !== null && (a = a.updateQueue, e === a)) {
                        var u = null,
                            n = null;
                        if (e = e.firstBaseUpdate, e !== null) {
                            do {
                                var i = {
                                    lane: e.lane,
                                    tag: e.tag,
                                    payload: e.payload,
                                    callback: null,
                                    next: null
                                };
                                n === null ? u = n = i : n = n.next = i, e = e.next
                            } while (e !== null);
                            n === null ? u = n = l : n = n.next = l
                        } else u = n = l;
                        e = {
                            baseState: a.baseState,
                            firstBaseUpdate: u,
                            lastBaseUpdate: n,
                            shared: a.shared,
                            callbacks: a.callbacks
                        }, t.updateQueue = e;
                        return
                    }
                    t = e.lastBaseUpdate, t === null ? e.firstBaseUpdate = l : t.next = l, e.lastBaseUpdate = l
                }
                var ic = !1;

                function cu() {
                    if (ic) {
                        var t = pa;
                        if (t !== null) throw t
                    }
                }

                function fu(t, l, e, a) {
                    ic = !1;
                    var u = t.updateQueue;
                    de = !1;
                    var n = u.firstBaseUpdate,
                        i = u.lastBaseUpdate,
                        c = u.shared.pending;
                    if (c !== null) {
                        u.shared.pending = null;
                        var o = c,
                            v = o.next;
                        o.next = null, i === null ? n = v : i.next = v, i = o;
                        var z = t.alternate;
                        z !== null && (z = z.updateQueue, c = z.lastBaseUpdate, c !== i && (c === null ? z.firstBaseUpdate = v : c.next = v, z.lastBaseUpdate = o))
                    }
                    if (n !== null) {
                        var H = u.baseState;
                        i = 0, z = v = o = null, c = n;
                        do {
                            var g = c.lane & -536870913,
                                x = g !== c.lane;
                            if (x ? (I & g) === g : (a & g) === g) {
                                g !== 0 && g === ga && (ic = !0), z !== null && (z = z.next = {
                                    lane: 0,
                                    tag: c.tag,
                                    payload: c.payload,
                                    callback: null,
                                    next: null
                                });
                                t: {
                                    var B = t,
                                        Q = c;g = l;
                                    var dt = e;
                                    switch (Q.tag) {
                                        case 1:
                                            if (B = Q.payload, typeof B == "function") {
                                                H = B.call(dt, H, g);
                                                break t
                                            }
                                            H = B;
                                            break t;
                                        case 3:
                                            B.flags = B.flags & -65537 | 128;
                                        case 0:
                                            if (B = Q.payload, g = typeof B == "function" ? B.call(dt, H, g) : B, g == null) break t;
                                            H = R({}, H, g);
                                            break t;
                                        case 2:
                                            de = !0
                                    }
                                }
                                g = c.callback, g !== null && (t.flags |= 64, x && (t.flags |= 8192), x = u.callbacks, x === null ? u.callbacks = [g] : x.push(g))
                            } else x = {
                                lane: g,
                                tag: c.tag,
                                payload: c.payload,
                                callback: c.callback,
                                next: null
                            }, z === null ? (v = z = x, o = H) : z = z.next = x, i |= g;
                            if (c = c.next, c === null) {
                                if (c = u.shared.pending, c === null) break;
                                x = c, c = x.next, x.next = null, u.lastBaseUpdate = x, u.shared.pending = null
                            }
                        } while (!0);
                        z === null && (o = H), u.baseState = o, u.firstBaseUpdate = v, u.lastBaseUpdate = z, n === null && (u.shared.lanes = 0), be |= i, t.lanes = i, t.memoizedState = H
                    }
                }

                function os(t, l) {
                    if (typeof t != "function") throw Error(s(191, t));
                    t.call(l)
                }

                function ss(t, l) {
                    var e = t.callbacks;
                    if (e !== null)
                        for (t.callbacks = null, t = 0; t < e.length; t++) os(e[t], l)
                }
                var xa = r(null),
                    dn = r(0);

                function rs(t, l) {
                    t = te, _(dn, t), _(xa, l), te = t | l.baseLanes
                }

                function cc() {
                    _(dn, te), _(xa, xa.current)
                }

                function fc() {
                    te = dn.current, T(xa), T(dn)
                }
                var dl = r(null),
                    Ml = null;

                function he(t) {
                    var l = t.alternate;
                    _(At, At.current & 1), _(dl, t), Ml === null && (l === null || xa.current !== null || l.memoizedState !== null) && (Ml = t)
                }

                function oc(t) {
                    _(At, At.current), _(dl, t), Ml === null && (Ml = t)
                }

                function ds(t) {
                    t.tag === 22 ? (_(At, At.current), _(dl, t), Ml === null && (Ml = t)) : ve()
                }

                function ve() {
                    _(At, At.current), _(dl, dl.current)
                }

                function ml(t) {
                    T(dl), Ml === t && (Ml = null), T(At)
                }
                var At = r(0);

                function mn(t) {
                    for (var l = t; l !== null;) {
                        if (l.tag === 13) {
                            var e = l.memoizedState;
                            if (e !== null && (e = e.dehydrated, e === null || vf(e) || gf(e))) return l
                        } else if (l.tag === 19 && (l.memoizedProps.revealOrder === "forwards" || l.memoizedProps.revealOrder === "backwards" || l.memoizedProps.revealOrder === "unstable_legacy-backwards" || l.memoizedProps.revealOrder === "together")) {
                            if ((l.flags & 128) !== 0) return l
                        } else if (l.child !== null) {
                            l.child.return = l, l = l.child;
                            continue
                        }
                        if (l === t) break;
                        for (; l.sibling === null;) {
                            if (l.return === null || l.return === t) return null;
                            l = l.return
                        }
                        l.sibling.return = l.return, l = l.sibling
                    }
                    return null
                }
                var Jl = 0,
                    J = null,
                    st = null,
                    Dt = null,
                    yn = !1,
                    Ea = !1,
                    Je = !1,
                    hn = 0,
                    ou = 0,
                    za = null,
                    Pm = 0;

                function Et() {
                    throw Error(s(321))
                }

                function sc(t, l) {
                    if (l === null) return !1;
                    for (var e = 0; e < l.length && e < t.length; e++)
                        if (!sl(t[e], l[e])) return !1;
                    return !0
                }

                function rc(t, l, e, a, u, n) {
                    return Jl = n, J = l, l.memoizedState = null, l.updateQueue = null, l.lanes = 0, M.H = t === null || t.memoizedState === null ? ks : Hc, Je = !1, n = e(a, u), Je = !1, Ea && (n = ys(l, e, a, u)), ms(t), n
                }

                function ms(t) {
                    M.H = du;
                    var l = st !== null && st.next !== null;
                    if (Jl = 0, Dt = st = J = null, yn = !1, ou = 0, za = null, l) throw Error(s(300));
                    t === null || Ot || (t = t.dependencies, t !== null && un(t) && (Ot = !0))
                }

                function ys(t, l, e, a) {
                    J = t;
                    var u = 0;
                    do {
                        if (Ea && (za = null), ou = 0, Ea = !1, 25 <= u) throw Error(s(301));
                        if (u += 1, Dt = st = null, t.updateQueue != null) {
                            var n = t.updateQueue;
                            n.lastEffect = null, n.events = null, n.stores = null, n.memoCache != null && (n.memoCache.index = 0)
                        }
                        M.H = $s, n = l(e, a)
                    } while (Ea);
                    return n
                }

                function Im() {
                    var t = M.H,
                        l = t.useState()[0];
                    return l = typeof l.then == "function" ? su(l) : l, t = t.useState()[0], (st !== null ? st.memoizedState : null) !== t && (J.flags |= 1024), l
                }

                function dc() {
                    var t = hn !== 0;
                    return hn = 0, t
                }

                function mc(t, l, e) {
                    l.updateQueue = t.updateQueue, l.flags &= -2053, t.lanes &= ~e
                }

                function yc(t) {
                    if (yn) {
                        for (t = t.memoizedState; t !== null;) {
                            var l = t.queue;
                            l !== null && (l.pending = null), t = t.next
                        }
                        yn = !1
                    }
                    Jl = 0, Dt = st = J = null, Ea = !1, ou = hn = 0, za = null
                }

                function Ft() {
                    var t = {
                        memoizedState: null,
                        baseState: null,
                        baseQueue: null,
                        queue: null,
                        next: null
                    };
                    return Dt === null ? J.memoizedState = Dt = t : Dt = Dt.next = t, Dt
                }

                function Ht() {
                    if (st === null) {
                        var t = J.alternate;
                        t = t !== null ? t.memoizedState : null
                    } else t = st.next;
                    var l = Dt === null ? J.memoizedState : Dt.next;
                    if (l !== null) Dt = l, st = t;
                    else {
                        if (t === null) throw J.alternate === null ? Error(s(467)) : Error(s(310));
                        st = t, t = {
                            memoizedState: st.memoizedState,
                            baseState: st.baseState,
                            baseQueue: st.baseQueue,
                            queue: st.queue,
                            next: null
                        }, Dt === null ? J.memoizedState = Dt = t : Dt = Dt.next = t
                    }
                    return Dt
                }

                function vn() {
                    return {
                        lastEffect: null,
                        events: null,
                        stores: null,
                        memoCache: null
                    }
                }

                function su(t) {
                    var l = ou;
                    return ou += 1, za === null && (za = []), t = us(za, t, l), l = J, (Dt === null ? l.memoizedState : Dt.next) === null && (l = l.alternate, M.H = l === null || l.memoizedState === null ? ks : Hc), t
                }

                function gn(t) {
                    if (t !== null && typeof t == "object") {
                        if (typeof t.then == "function") return su(t);
                        if (t.$$typeof === Mt) return Xt(t)
                    }
                    throw Error(s(438, String(t)))
                }

                function hc(t) {
                    var l = null,
                        e = J.updateQueue;
                    if (e !== null && (l = e.memoCache), l == null) {
                        var a = J.alternate;
                        a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (l = {
                            data: a.data.map(function(u) {
                                return u.slice()
                            }),
                            index: 0
                        })))
                    }
                    if (l == null && (l = {
                        data: [],
                        index: 0
                    }), e === null && (e = vn(), J.updateQueue = e), e.memoCache = l, e = l.data[l.index], e === void 0)
                        for (e = l.data[l.index] = Array(t), a = 0; a < t; a++) e[a] = Ol;
                    return l.index++, e
                }

                function wl(t, l) {
                    return typeof l == "function" ? l(t) : l
                }

                function pn(t) {
                    var l = Ht();
                    return vc(l, st, t)
                }

                function vc(t, l, e) {
                    var a = t.queue;
                    if (a === null) throw Error(s(311));
                    a.lastRenderedReducer = e;
                    var u = t.baseQueue,
                        n = a.pending;
                    if (n !== null) {
                        if (u !== null) {
                            var i = u.next;
                            u.next = n.next, n.next = i
                        }
                        l.baseQueue = u = n, a.pending = null
                    }
                    if (n = t.baseState, u === null) t.memoizedState = n;
                    else {
                        l = u.next;
                        var c = i = null,
                            o = null,
                            v = l,
                            z = !1;
                        do {
                            var H = v.lane & -536870913;
                            if (H !== v.lane ? (I & H) === H : (Jl & H) === H) {
                                var g = v.revertLane;
                                if (g === 0) o !== null && (o = o.next = {
                                    lane: 0,
                                    revertLane: 0,
                                    gesture: null,
                                    action: v.action,
                                    hasEagerState: v.hasEagerState,
                                    eagerState: v.eagerState,
                                    next: null
                                }), H === ga && (z = !0);
                                else if ((Jl & g) === g) {
                                    v = v.next, g === ga && (z = !0);
                                    continue
                                } else H = {
                                    lane: 0,
                                    revertLane: v.revertLane,
                                    gesture: null,
                                    action: v.action,
                                    hasEagerState: v.hasEagerState,
                                    eagerState: v.eagerState,
                                    next: null
                                }, o === null ? (c = o = H, i = n) : o = o.next = H, J.lanes |= g, be |= g;
                                H = v.action, Je && e(n, H), n = v.hasEagerState ? v.eagerState : e(n, H)
                            } else g = {
                                lane: H,
                                revertLane: v.revertLane,
                                gesture: v.gesture,
                                action: v.action,
                                hasEagerState: v.hasEagerState,
                                eagerState: v.eagerState,
                                next: null
                            }, o === null ? (c = o = g, i = n) : o = o.next = g, J.lanes |= H, be |= H;
                            v = v.next
                        } while (v !== null && v !== l);
                        if (o === null ? i = n : o.next = c, !sl(n, t.memoizedState) && (Ot = !0, z && (e = pa, e !== null))) throw e;
                        t.memoizedState = n, t.baseState = i, t.baseQueue = o, a.lastRenderedState = n
                    }
                    return u === null && (a.lanes = 0), [t.memoizedState, a.dispatch]
                }

                function gc(t) {
                    var l = Ht(),
                        e = l.queue;
                    if (e === null) throw Error(s(311));
                    e.lastRenderedReducer = t;
                    var a = e.dispatch,
                        u = e.pending,
                        n = l.memoizedState;
                    if (u !== null) {
                        e.pending = null;
                        var i = u = u.next;
                        do n = t(n, i.action), i = i.next; while (i !== u);
                        sl(n, l.memoizedState) || (Ot = !0), l.memoizedState = n, l.baseQueue === null && (l.baseState = n), e.lastRenderedState = n
                    }
                    return [n, a]
                }

                function hs(t, l, e) {
                    var a = J,
                        u = Ht(),
                        n = lt;
                    if (n) {
                        if (e === void 0) throw Error(s(407));
                        e = e()
                    } else e = l();
                    var i = !sl((st || u).memoizedState, e);
                    if (i && (u.memoizedState = e, Ot = !0), u = u.queue, Sc(ps.bind(null, a, u, t), [t]), u.getSnapshot !== l || i || Dt !== null && Dt.memoizedState.tag & 1) {
                        if (a.flags |= 2048, Ta(9, {
                            destroy: void 0
                        }, gs.bind(null, a, u, e, l), null), yt === null) throw Error(s(349));
                        n || (Jl & 127) !== 0 || vs(a, l, e)
                    }
                    return e
                }

                function vs(t, l, e) {
                    t.flags |= 16384, t = {
                        getSnapshot: l,
                        value: e
                    }, l = J.updateQueue, l === null ? (l = vn(), J.updateQueue = l, l.stores = [t]) : (e = l.stores, e === null ? l.stores = [t] : e.push(t))
                }

                function gs(t, l, e, a) {
                    l.value = e, l.getSnapshot = a, bs(l) && Ss(t)
                }

                function ps(t, l, e) {
                    return e(function() {
                        bs(l) && Ss(t)
                    })
                }

                function bs(t) {
                    var l = t.getSnapshot;
                    t = t.value;
                    try {
                        var e = l();
                        return !sl(t, e)
                    } catch {
                        return !0
                    }
                }

                function Ss(t) {
                    var l = qe(t, 2);
                    l !== null && nl(l, t, 2)
                }

                function pc(t) {
                    var l = Ft();
                    if (typeof t == "function") {
                        var e = t;
                        if (t = e(), Je) {
                            ne(!0);
                            try {
                                e()
                            } finally {
                                ne(!1)
                            }
                        }
                    }
                    return l.memoizedState = l.baseState = t, l.queue = {
                        pending: null,
                        lanes: 0,
                        dispatch: null,
                        lastRenderedReducer: wl,
                        lastRenderedState: t
                    }, l
                }

                function xs(t, l, e, a) {
                    return t.baseState = e, vc(t, st, typeof a == "function" ? a : wl)
                }

                function ty(t, l, e, a, u) {
                    if (xn(t)) throw Error(s(485));
                    if (t = l.action, t !== null) {
                        var n = {
                            payload: u,
                            action: t,
                            next: null,
                            isTransition: !0,
                            status: "pending",
                            value: null,
                            reason: null,
                            listeners: [],
                            then: function(i) {
                                n.listeners.push(i)
                            }
                        };
                        M.T !== null ? e(!0) : n.isTransition = !1, a(n), e = l.pending, e === null ? (n.next = l.pending = n, Es(l, n)) : (n.next = e.next, l.pending = e.next = n)
                    }
                }

                function Es(t, l) {
                    var e = l.action,
                        a = l.payload,
                        u = t.state;
                    if (l.isTransition) {
                        var n = M.T,
                            i = {};
                        M.T = i;
                        try {
                            var c = e(u, a),
                                o = M.S;
                            o !== null && o(i, c), zs(t, l, c)
                        } catch (v) {
                            bc(t, l, v)
                        } finally {
                            n !== null && i.types !== null && (n.types = i.types), M.T = n
                        }
                    } else try {
                        n = e(u, a), zs(t, l, n)
                    } catch (v) {
                        bc(t, l, v)
                    }
                }

                function zs(t, l, e) {
                    e !== null && typeof e == "object" && typeof e.then == "function" ? e.then(function(a) {
                        Ts(t, l, a)
                    }, function(a) {
                        return bc(t, l, a)
                    }) : Ts(t, l, e)
                }

                function Ts(t, l, e) {
                    l.status = "fulfilled", l.value = e, As(l), t.state = e, l = t.pending, l !== null && (e = l.next, e === l ? t.pending = null : (e = e.next, l.next = e, Es(t, e)))
                }

                function bc(t, l, e) {
                    var a = t.pending;
                    if (t.pending = null, a !== null) {
                        a = a.next;
                        do l.status = "rejected", l.reason = e, As(l), l = l.next; while (l !== a)
                    }
                    t.action = null
                    }

                    function As(t) {
                        t = t.listeners;
                        for (var l = 0; l < t.length; l++)(0, t[l])()
                    }

                    function Hs(t, l) {
                        return l
                    }

                    function Ms(t, l) {
                        if (lt) {
                            var e = yt.formState;
                            if (e !== null) {
                                t: {
                                    var a = J;
                                    if (lt) {
                                        if (ht) {
                                            l: {
                                                for (var u = ht, n = Hl; u.nodeType !== 8;) {
                                                    if (!n) {
                                                        u = null;
                                                        break l
                                                    }
                                                    if (u = _l(u.nextSibling), u === null) {
                                                        u = null;
                                                        break l
                                                    }
                                                }
                                                n = u.data,
                                                    u = n === "F!" || n === "F" ? u : null
                                            }
                                            if (u) {
                                                ht = _l(u.nextSibling), a = u.data === "F!";
                                                break t
                                            }
                                        }
                                        se(a)
                                    }
                                    a = !1
                                }
                                a && (l = e[0])
                            }
                        }
                        return e = Ft(), e.memoizedState = e.baseState = l, a = {
                            pending: null,
                            lanes: 0,
                            dispatch: null,
                            lastRenderedReducer: Hs,
                            lastRenderedState: l
                        }, e.queue = a, e = Js.bind(null, J, a), a.dispatch = e, a = pc(!1), n = Ac.bind(null, J, !1, a.queue), a = Ft(), u = {
                            state: l,
                            dispatch: null,
                            action: t,
                            pending: null
                        }, a.queue = u, e = ty.bind(null, J, u, n, e), u.dispatch = e, a.memoizedState = t, [l, e, !1]
                    }

                    function _s(t) {
                        var l = Ht();
                        return Ds(l, st, t)
                    }

                    function Ds(t, l, e) {
                        if (l = vc(t, l, Hs)[0], t = pn(wl)[0], typeof l == "object" && l !== null && typeof l.then == "function") try {
                            var a = su(l)
                            } catch (i) {
                                throw i === ba ? fn : i
                            } else a = l;
                        l = Ht();
                        var u = l.queue,
                            n = u.dispatch;
                        return e !== l.memoizedState && (J.flags |= 2048, Ta(9, {
                            destroy: void 0
                        }, ly.bind(null, u, e), null)), [a, n, t]
                    }

                    function ly(t, l) {
                        t.action = l
                    }

                    function Os(t) {
                        var l = Ht(),
                            e = st;
                        if (e !== null) return Ds(l, e, t);
                        Ht(), l = l.memoizedState, e = Ht();
                        var a = e.queue.dispatch;
                        return e.memoizedState = t, [l, a, !1]
                    }

                    function Ta(t, l, e, a) {
                        return t = {
                            tag: t,
                            create: e,
                            deps: a,
                            inst: l,
                            next: null
                        }, l = J.updateQueue, l === null && (l = vn(), J.updateQueue = l), e = l.lastEffect, e === null ? l.lastEffect = t.next = t : (a = e.next, e.next = t, t.next = a, l.lastEffect = t), t
                    }

                    function Us() {
                        return Ht().memoizedState
                    }

                    function bn(t, l, e, a) {
                        var u = Ft();
                        J.flags |= t, u.memoizedState = Ta(1 | l, {
                            destroy: void 0
                        }, e, a === void 0 ? null : a)
                    }

                    function Sn(t, l, e, a) {
                        var u = Ht();
                        a = a === void 0 ? null : a;
                        var n = u.memoizedState.inst;
                        st !== null && a !== null && sc(a, st.memoizedState.deps) ? u.memoizedState = Ta(l, n, e, a) : (J.flags |= t, u.memoizedState = Ta(1 | l, n, e, a))
                    }

                    function js(t, l) {
                        bn(8390656, 8, t, l)
                    }

                    function Sc(t, l) {
                        Sn(2048, 8, t, l)
                    }

                    function ey(t) {
                        J.flags |= 4;
                        var l = J.updateQueue;
                        if (l === null) l = vn(), J.updateQueue = l, l.events = [t];
                        else {
                            var e = l.events;
                            e === null ? l.events = [t] : e.push(t)
                        }
                    }

                    function Cs(t) {
                        var l = Ht().memoizedState;
                        return ey({
                            ref: l,
                            nextImpl: t
                        }),
                            function() {
                            if ((it & 2) !== 0) throw Error(s(440));
                            return l.impl.apply(void 0, arguments)
                        }
                    }

                    function Bs(t, l) {
                        return Sn(4, 2, t, l)
                    }

                    function Rs(t, l) {
                        return Sn(4, 4, t, l)
                    }

                    function Ns(t, l) {
                        if (typeof l == "function") {
                            t = t();
                            var e = l(t);
                            return function() {
                                typeof e == "function" ? e() : l(null)
                            }
                        }
                        if (l != null) return t = t(), l.current = t,
                            function() {
                            l.current = null
                        }
                    }

                    function qs(t, l, e) {
                        e = e != null ? e.concat([t]) : null, Sn(4, 4, Ns.bind(null, l, t), e)
                    }

                    function xc() {}

                    function Ys(t, l) {
                        var e = Ht();
                        l = l === void 0 ? null : l;
                        var a = e.memoizedState;
                        return l !== null && sc(l, a[1]) ? a[0] : (e.memoizedState = [t, l], t)
                    }

                    function Gs(t, l) {
                        var e = Ht();
                        l = l === void 0 ? null : l;
                        var a = e.memoizedState;
                        if (l !== null && sc(l, a[1])) return a[0];
                        if (a = t(), Je) {
                            ne(!0);
                            try {
                                t()
                            } finally {
                                ne(!1)
                            }
                        }
                        return e.memoizedState = [a, l], a
                    }

                    function Ec(t, l, e) {
                        return e === void 0 || (Jl & 1073741824) !== 0 && (I & 261930) === 0 ? t.memoizedState = l : (t.memoizedState = e, t = Xr(), J.lanes |= t, be |= t, e)
                    }

                    function Xs(t, l, e, a) {
                        return sl(e, l) ? e : xa.current !== null ? (t = Ec(t, e, a), sl(t, l) || (Ot = !0), t) : (Jl & 42) === 0 || (Jl & 1073741824) !== 0 && (I & 261930) === 0 ? (Ot = !0, t.memoizedState = e) : (t = Xr(), J.lanes |= t, be |= t, l)
                    }

                    function Qs(t, l, e, a, u) {
                        var n = U.p;
                        U.p = n !== 0 && 8 > n ? n : 8;
                        var i = M.T,
                            c = {};
                        M.T = c, Ac(t, !1, l, e);
                        try {
                            var o = u(),
                                v = M.S;
                            if (v !== null && v(c, o), o !== null && typeof o == "object" && typeof o.then == "function") {
                                var z = Fm(o, a);
                                ru(t, l, z, vl(t))
                            } else ru(t, l, a, vl(t))
                        } catch (H) {
                            ru(t, l, {
                                then: function() {},
                                status: "rejected",
                                reason: H
                            }, vl())
                        } finally {
                            U.p = n, i !== null && c.types !== null && (i.types = c.types), M.T = i
                        }
                    }

                    function ay() {}

                    function zc(t, l, e, a) {
                        if (t.tag !== 5) throw Error(s(476));
                        var u = Zs(t).queue;
                        Qs(t, u, l, et, e === null ? ay : function() {
                            return Ls(t), e(a)
                        })
                    }

                    function Zs(t) {
                        var l = t.memoizedState;
                        if (l !== null) return l;
                        l = {
                            memoizedState: et,
                            baseState: et,
                            baseQueue: null,
                            queue: {
                                pending: null,
                                lanes: 0,
                                dispatch: null,
                                lastRenderedReducer: wl,
                                lastRenderedState: et
                            },
                            next: null
                        };
                        var e = {};
                        return l.next = {
                            memoizedState: e,
                            baseState: e,
                            baseQueue: null,
                            queue: {
                                pending: null,
                                lanes: 0,
                                dispatch: null,
                                lastRenderedReducer: wl,
                                lastRenderedState: e
                            },
                            next: null
                        }, t.memoizedState = l, t = t.alternate, t !== null && (t.memoizedState = l), l
                    }

                    function Ls(t) {
                        var l = Zs(t);
                        l.next === null && (l = t.alternate.memoizedState), ru(t, l.next.queue, {}, vl())
                    }

                    function Tc() {
                        return Xt(_u)
                    }

                    function Vs() {
                        return Ht().memoizedState
                    }

                    function Ks() {
                        return Ht().memoizedState
                    }

                    function uy(t) {
                        for (var l = t.return; l !== null;) {
                            switch (l.tag) {
                                case 24:
                                case 3:
                                    var e = vl();
                                    t = me(e);
                                    var a = ye(l, t, e);
                                    a !== null && (nl(a, l, e), iu(a, l, e)), l = {
                                        cache: Ii()
                                    }, t.payload = l;
                                    return
                            }
                            l = l.return
                        }
                    }

                    function ny(t, l, e) {
                        var a = vl();
                        e = {
                            lane: a,
                            revertLane: 0,
                            gesture: null,
                            action: e,
                            hasEagerState: !1,
                            eagerState: null,
                            next: null
                        }, xn(t) ? ws(l, e) : (e = Zi(t, l, e, a), e !== null && (nl(e, t, a), Ws(e, l, a)))
                    }

                    function Js(t, l, e) {
                        var a = vl();
                        ru(t, l, e, a)
                    }

                    function ru(t, l, e, a) {
                        var u = {
                            lane: a,
                            revertLane: 0,
                            gesture: null,
                            action: e,
                            hasEagerState: !1,
                            eagerState: null,
                            next: null
                        };
                        if (xn(t)) ws(l, u);
                        else {
                            var n = t.alternate;
                            if (t.lanes === 0 && (n === null || n.lanes === 0) && (n = l.lastRenderedReducer, n !== null)) try {
                                var i = l.lastRenderedState,
                                    c = n(i, e);
                                if (u.hasEagerState = !0, u.eagerState = c, sl(c, i)) return tn(t, l, u, 0), yt === null && Iu(), !1
                            } catch {}
                            if (e = Zi(t, l, u, a), e !== null) return nl(e, t, a), Ws(e, l, a), !0
                        }
                        return !1
                    }

                    function Ac(t, l, e, a) {
                        if (a = {
                            lane: 2,
                            revertLane: af(),
                            gesture: null,
                            action: a,
                            hasEagerState: !1,
                            eagerState: null,
                            next: null
                        }, xn(t)) {
                            if (l) throw Error(s(479))
                        } else l = Zi(t, e, a, 2), l !== null && nl(l, t, 2)
                    }

                    function xn(t) {
                        var l = t.alternate;
                        return t === J || l !== null && l === J
                    }

                    function ws(t, l) {
                        Ea = yn = !0;
                        var e = t.pending;
                        e === null ? l.next = l : (l.next = e.next, e.next = l), t.pending = l
                    }

                    function Ws(t, l, e) {
                        if ((e & 4194048) !== 0) {
                            var a = l.lanes;
                            a &= t.pendingLanes, e |= a, l.lanes = e, Pf(t, e)
                        }
                    }
                    var du = {
                        readContext: Xt,
                        use: gn,
                        useCallback: Et,
                        useContext: Et,
                        useEffect: Et,
                        useImperativeHandle: Et,
                        useLayoutEffect: Et,
                        useInsertionEffect: Et,
                        useMemo: Et,
                        useReducer: Et,
                        useRef: Et,
                        useState: Et,
                        useDebugValue: Et,
                        useDeferredValue: Et,
                        useTransition: Et,
                        useSyncExternalStore: Et,
                        useId: Et,
                        useHostTransitionStatus: Et,
                        useFormState: Et,
                        useActionState: Et,
                        useOptimistic: Et,
                        useMemoCache: Et,
                        useCacheRefresh: Et
                    };
                    du.useEffectEvent = Et;
                    var ks = {
                        readContext: Xt,
                        use: gn,
                        useCallback: function(t, l) {
                            return Ft().memoizedState = [t, l === void 0 ? null : l], t
                        },
                        useContext: Xt,
                        useEffect: js,
                        useImperativeHandle: function(t, l, e) {
                            e = e != null ? e.concat([t]) : null, bn(4194308, 4, Ns.bind(null, l, t), e)
                        },
                        useLayoutEffect: function(t, l) {
                            return bn(4194308, 4, t, l)
                        },
                        useInsertionEffect: function(t, l) {
                            bn(4, 2, t, l)
                        },
                        useMemo: function(t, l) {
                            var e = Ft();
                            l = l === void 0 ? null : l;
                            var a = t();
                            if (Je) {
                                ne(!0);
                                try {
                                    t()
                                } finally {
                                    ne(!1)
                                }
                            }
                            return e.memoizedState = [a, l], a
                        },
                        useReducer: function(t, l, e) {
                            var a = Ft();
                            if (e !== void 0) {
                                var u = e(l);
                                if (Je) {
                                    ne(!0);
                                    try {
                                        e(l)
                                    } finally {
                                        ne(!1)
                                    }
                                }
                            } else u = l;
                            return a.memoizedState = a.baseState = u, t = {
                                pending: null,
                                lanes: 0,
                                dispatch: null,
                                lastRenderedReducer: t,
                                lastRenderedState: u
                            }, a.queue = t, t = t.dispatch = ny.bind(null, J, t), [a.memoizedState, t]
                        },
                        useRef: function(t) {
                            var l = Ft();
                            return t = {
                                current: t
                            }, l.memoizedState = t
                        },
                        useState: function(t) {
                            t = pc(t);
                            var l = t.queue,
                                e = Js.bind(null, J, l);
                            return l.dispatch = e, [t.memoizedState, e]
                        },
                        useDebugValue: xc,
                        useDeferredValue: function(t, l) {
                            var e = Ft();
                            return Ec(e, t, l)
                        },
                        useTransition: function() {
                            var t = pc(!1);
                            return t = Qs.bind(null, J, t.queue, !0, !1), Ft().memoizedState = t, [!1, t]
                        },
                        useSyncExternalStore: function(t, l, e) {
                            var a = J,
                                u = Ft();
                            if (lt) {
                                if (e === void 0) throw Error(s(407));
                                e = e()
                            } else {
                                if (e = l(), yt === null) throw Error(s(349));
                                (I & 127) !== 0 || vs(a, l, e)
                            }
                            u.memoizedState = e;
                            var n = {
                                value: e,
                                getSnapshot: l
                            };
                            return u.queue = n, js(ps.bind(null, a, n, t), [t]), a.flags |= 2048, Ta(9, {
                                destroy: void 0
                            }, gs.bind(null, a, n, e, l), null), e
                        },
                        useId: function() {
                            var t = Ft(),
                                l = yt.identifierPrefix;
                            if (lt) {
                                var e = Rl,
                                    a = Bl;
                                e = (a & ~(1 << 32 - ol(a) - 1)).toString(32) + e, l = "_" + l + "R_" + e, e = hn++, 0 < e && (l += "H" + e.toString(32)), l += "_"
                            } else e = Pm++, l = "_" + l + "r_" + e.toString(32) + "_";
                            return t.memoizedState = l
                        },
                        useHostTransitionStatus: Tc,
                        useFormState: Ms,
                        useActionState: Ms,
                        useOptimistic: function(t) {
                            var l = Ft();
                            l.memoizedState = l.baseState = t;
                            var e = {
                                pending: null,
                                lanes: 0,
                                dispatch: null,
                                lastRenderedReducer: null,
                                lastRenderedState: null
                            };
                            return l.queue = e, l = Ac.bind(null, J, !0, e), e.dispatch = l, [t, l]
                        },
                        useMemoCache: hc,
                        useCacheRefresh: function() {
                            return Ft().memoizedState = uy.bind(null, J)
                        },
                        useEffectEvent: function(t) {
                            var l = Ft(),
                                e = {
                                    impl: t
                                };
                            return l.memoizedState = e,
                                function() {
                                if ((it & 2) !== 0) throw Error(s(440));
                                return e.impl.apply(void 0, arguments)
                            }
                        }
                    },
                        Hc = {
                            readContext: Xt,
                            use: gn,
                            useCallback: Ys,
                            useContext: Xt,
                            useEffect: Sc,
                            useImperativeHandle: qs,
                            useInsertionEffect: Bs,
                            useLayoutEffect: Rs,
                            useMemo: Gs,
                            useReducer: pn,
                            useRef: Us,
                            useState: function() {
                                return pn(wl)
                            },
                            useDebugValue: xc,
                            useDeferredValue: function(t, l) {
                                var e = Ht();
                                return Xs(e, st.memoizedState, t, l)
                            },
                            useTransition: function() {
                                var t = pn(wl)[0],
                                    l = Ht().memoizedState;
                                return [typeof t == "boolean" ? t : su(t), l]
                            },
                            useSyncExternalStore: hs,
                            useId: Vs,
                            useHostTransitionStatus: Tc,
                            useFormState: _s,
                            useActionState: _s,
                            useOptimistic: function(t, l) {
                                var e = Ht();
                                return xs(e, st, t, l)
                            },
                            useMemoCache: hc,
                            useCacheRefresh: Ks
                        };
                    Hc.useEffectEvent = Cs;
                    var $s = {
                        readContext: Xt,
                        use: gn,
                        useCallback: Ys,
                        useContext: Xt,
                        useEffect: Sc,
                        useImperativeHandle: qs,
                        useInsertionEffect: Bs,
                        useLayoutEffect: Rs,
                        useMemo: Gs,
                        useReducer: gc,
                        useRef: Us,
                        useState: function() {
                            return gc(wl)
                        },
                        useDebugValue: xc,
                        useDeferredValue: function(t, l) {
                            var e = Ht();
                            return st === null ? Ec(e, t, l) : Xs(e, st.memoizedState, t, l)
                        },
                        useTransition: function() {
                            var t = gc(wl)[0],
                                l = Ht().memoizedState;
                            return [typeof t == "boolean" ? t : su(t), l]
                        },
                        useSyncExternalStore: hs,
                        useId: Vs,
                        useHostTransitionStatus: Tc,
                        useFormState: Os,
                        useActionState: Os,
                        useOptimistic: function(t, l) {
                            var e = Ht();
                            return st !== null ? xs(e, st, t, l) : (e.baseState = t, [t, e.queue.dispatch])
                        },
                        useMemoCache: hc,
                        useCacheRefresh: Ks
                    };
                    $s.useEffectEvent = Cs;

                    function Mc(t, l, e, a) {
                        l = t.memoizedState, e = e(a, l), e = e == null ? l : R({}, l, e), t.memoizedState = e, t.lanes === 0 && (t.updateQueue.baseState = e)
                    }
                    var _c = {
                        enqueueSetState: function(t, l, e) {
                            t = t._reactInternals;
                            var a = vl(),
                                u = me(a);
                            u.payload = l, e != null && (u.callback = e), l = ye(t, u, a), l !== null && (nl(l, t, a), iu(l, t, a))
                        },
                        enqueueReplaceState: function(t, l, e) {
                            t = t._reactInternals;
                            var a = vl(),
                                u = me(a);
                            u.tag = 1, u.payload = l, e != null && (u.callback = e), l = ye(t, u, a), l !== null && (nl(l, t, a), iu(l, t, a))
                        },
                        enqueueForceUpdate: function(t, l) {
                            t = t._reactInternals;
                            var e = vl(),
                                a = me(e);
                            a.tag = 2, l != null && (a.callback = l), l = ye(t, a, e), l !== null && (nl(l, t, e), iu(l, t, e))
                        }
                    };

                    function Fs(t, l, e, a, u, n, i) {
                        return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(a, n, i) : l.prototype && l.prototype.isPureReactComponent ? !Pa(e, a) || !Pa(u, n) : !0
                    }

                    function Ps(t, l, e, a) {
                        t = l.state, typeof l.componentWillReceiveProps == "function" && l.componentWillReceiveProps(e, a), typeof l.UNSAFE_componentWillReceiveProps == "function" && l.UNSAFE_componentWillReceiveProps(e, a), l.state !== t && _c.enqueueReplaceState(l, l.state, null)
                    }

                    function we(t, l) {
                        var e = l;
                        if ("ref" in l) {
                            e = {};
                            for (var a in l) a !== "ref" && (e[a] = l[a])
                        }
                        if (t = t.defaultProps) {
                            e === l && (e = R({}, e));
                            for (var u in t) e[u] === void 0 && (e[u] = t[u])
                        }
                        return e
                    }

                    function Is(t) {
                        Pu(t)
                    }

                    function tr(t) {
                        console.error(t)
                    }

                    function lr(t) {
                        Pu(t)
                    }

                    function En(t, l) {
                        try {
                            var e = t.onUncaughtError;
                            e(l.value, {
                                componentStack: l.stack
                            })
                        } catch (a) {
                            setTimeout(function() {
                                throw a
                            })
                        }
                    }

                    function er(t, l, e) {
                        try {
                            var a = t.onCaughtError;
                            a(e.value, {
                                componentStack: e.stack,
                                errorBoundary: l.tag === 1 ? l.stateNode : null
                            })
                        } catch (u) {
                            setTimeout(function() {
                                throw u
                            })
                        }
                    }

                    function Dc(t, l, e) {
                        return e = me(e), e.tag = 3, e.payload = {
                            element: null
                        }, e.callback = function() {
                            En(t, l)
                        }, e
                    }

                    function ar(t) {
                        return t = me(t), t.tag = 3, t
                    }

                    function ur(t, l, e, a) {
                        var u = e.type.getDerivedStateFromError;
                        if (typeof u == "function") {
                            var n = a.value;
                            t.payload = function() {
                                return u(n)
                            }, t.callback = function() {
                                er(l, e, a)
                            }
                        }
                        var i = e.stateNode;
                        i !== null && typeof i.componentDidCatch == "function" && (t.callback = function() {
                            er(l, e, a), typeof u != "function" && (Se === null ? Se = new Set([this]) : Se.add(this));
                            var c = a.stack;
                            this.componentDidCatch(a.value, {
                                componentStack: c !== null ? c : ""
                            })
                        })
                    }

                    function iy(t, l, e, a, u) {
                        if (e.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
                            if (l = e.alternate, l !== null && va(l, e, u, !0), e = dl.current, e !== null) {
                                switch (e.tag) {
                                    case 31:
                                    case 13:
                                        return Ml === null ? Bn() : e.alternate === null && zt === 0 && (zt = 3), e.flags &= -257, e.flags |= 65536, e.lanes = u, a === on ? e.flags |= 16384 : (l = e.updateQueue, l === null ? e.updateQueue = new Set([a]) : l.add(a), tf(t, a, u)), !1;
                                    case 22:
                                        return e.flags |= 65536, a === on ? e.flags |= 16384 : (l = e.updateQueue, l === null ? (l = {
                                            transitions: null,
                                            markerInstances: null,
                                            retryQueue: new Set([a])
                                        }, e.updateQueue = l) : (e = l.retryQueue, e === null ? l.retryQueue = new Set([a]) : e.add(a)), tf(t, a, u)), !1
                                }
                                throw Error(s(435, e.tag))
                            }
                            return tf(t, a, u), Bn(), !1
                        }
                        if (lt) return l = dl.current, l !== null ? ((l.flags & 65536) === 0 && (l.flags |= 256), l.flags |= 65536, l.lanes = u, a !== Wi && (t = Error(s(422), {
                            cause: a
                        }), lu(zl(t, e)))) : (a !== Wi && (l = Error(s(423), {
                            cause: a
                        }), lu(zl(l, e))), t = t.current.alternate, t.flags |= 65536, u &= -u, t.lanes |= u, a = zl(a, e), u = Dc(t.stateNode, a, u), nc(t, u), zt !== 4 && (zt = 2)), !1;
                        var n = Error(s(520), {
                            cause: a
                        });
                        if (n = zl(n, e), Su === null ? Su = [n] : Su.push(n), zt !== 4 && (zt = 2), l === null) return !0;
                        a = zl(a, e), e = l;
                        do {
                            switch (e.tag) {
                                case 3:
                                    return e.flags |= 65536, t = u & -u, e.lanes |= t, t = Dc(e.stateNode, a, t), nc(e, t), !1;
                                case 1:
                                    if (l = e.type, n = e.stateNode, (e.flags & 128) === 0 && (typeof l.getDerivedStateFromError == "function" || n !== null && typeof n.componentDidCatch == "function" && (Se === null || !Se.has(n)))) return e.flags |= 65536, u &= -u, e.lanes |= u, u = ar(u), ur(u, t, e, a), nc(e, u), !1
                            }
                            e = e.return
                        } while (e !== null);
                        return !1
                    }
                    var Oc = Error(s(461)),
                        Ot = !1;

                    function Qt(t, l, e, a) {
                        l.child = t === null ? fs(l, null, e, a) : Ke(l, t.child, e, a)
                    }

                    function nr(t, l, e, a, u) {
                        e = e.render;
                        var n = l.ref;
                        if ("ref" in a) {
                            var i = {};
                            for (var c in a) c !== "ref" && (i[c] = a[c])
                        } else i = a;
                        return Qe(l), a = rc(t, l, e, i, n, u), c = dc(), t !== null && !Ot ? (mc(t, l, u), Wl(t, l, u)) : (lt && c && Ji(l), l.flags |= 1, Qt(t, l, a, u), l.child)
                    }

                    function ir(t, l, e, a, u) {
                        if (t === null) {
                            var n = e.type;
                            return typeof n == "function" && !Li(n) && n.defaultProps === void 0 && e.compare === null ? (l.tag = 15, l.type = n, cr(t, l, n, a, u)) : (t = en(e.type, null, a, l, l.mode, u), t.ref = l.ref, t.return = l, l.child = t)
                        }
                        if (n = t.child, !Yc(t, u)) {
                            var i = n.memoizedProps;
                            if (e = e.compare, e = e !== null ? e : Pa, e(i, a) && t.ref === l.ref) return Wl(t, l, u)
                        }
                        return l.flags |= 1, t = Zl(n, a), t.ref = l.ref, t.return = l, l.child = t
                    }

                    function cr(t, l, e, a, u) {
                        if (t !== null) {
                            var n = t.memoizedProps;
                            if (Pa(n, a) && t.ref === l.ref)
                                if (Ot = !1, l.pendingProps = a = n, Yc(t, u))(t.flags & 131072) !== 0 && (Ot = !0);
                                else return l.lanes = t.lanes, Wl(t, l, u)
                        }
                        return Uc(t, l, e, a, u)
                    }

                    function fr(t, l, e, a) {
                        var u = a.children,
                            n = t !== null ? t.memoizedState : null;
                        if (t === null && l.stateNode === null && (l.stateNode = {
                            _visibility: 1,
                            _pendingMarkers: null,
                            _retryCache: null,
                            _transitions: null
                        }), a.mode === "hidden") {
                            if ((l.flags & 128) !== 0) {
                                if (n = n !== null ? n.baseLanes | e : e, t !== null) {
                                    for (a = l.child = t.child, u = 0; a !== null;) u = u | a.lanes | a.childLanes, a = a.sibling;
                                    a = u & ~n
                                } else a = 0, l.child = null;
                                return or(t, l, n, e, a)
                            }
                            if ((e & 536870912) !== 0) l.memoizedState = {
                                baseLanes: 0,
                                cachePool: null
                            }, t !== null && cn(l, n !== null ? n.cachePool : null), n !== null ? rs(l, n) : cc(), ds(l);
                            else return a = l.lanes = 536870912, or(t, l, n !== null ? n.baseLanes | e : e, e, a)
                        } else n !== null ? (cn(l, n.cachePool), rs(l, n), ve(), l.memoizedState = null) : (t !== null && cn(l, null), cc(), ve());
                        return Qt(t, l, u, e), l.child
                    }

                    function mu(t, l) {
                        return t !== null && t.tag === 22 || l.stateNode !== null || (l.stateNode = {
                            _visibility: 1,
                            _pendingMarkers: null,
                            _retryCache: null,
                            _transitions: null
                        }), l.sibling
                    }

                    function or(t, l, e, a, u) {
                        var n = lc();
                        return n = n === null ? null : {
                            parent: _t._currentValue,
                            pool: n
                        }, l.memoizedState = {
                            baseLanes: e,
                            cachePool: n
                        }, t !== null && cn(l, null), cc(), ds(l), t !== null && va(t, l, a, !0), l.childLanes = u, null
                    }

                    function zn(t, l) {
                        return l = An({
                            mode: l.mode,
                            children: l.children
                        }, t.mode), l.ref = t.ref, t.child = l, l.return = t, l
                    }

                    function sr(t, l, e) {
                        return Ke(l, t.child, null, e), t = zn(l, l.pendingProps), t.flags |= 2, ml(l), l.memoizedState = null, t
                    }

                    function cy(t, l, e) {
                        var a = l.pendingProps,
                            u = (l.flags & 128) !== 0;
                        if (l.flags &= -129, t === null) {
                            if (lt) {
                                if (a.mode === "hidden") return t = zn(l, a), l.lanes = 536870912, mu(null, t);
                                if (oc(l), (t = ht) ? (t = Ed(t, Hl), t = t !== null && t.data === "&" ? t : null, t !== null && (l.memoizedState = {
                                    dehydrated: t,
                                    treeContext: fe !== null ? {
                                        id: Bl,
                                        overflow: Rl
                                    } : null,
                                    retryLane: 536870912,
                                    hydrationErrors: null
                                }, e = wo(t), e.return = l, l.child = e, Gt = l, ht = null)) : t = null, t === null) throw se(l);
                                return l.lanes = 536870912, null
                            }
                            return zn(l, a)
                        }
                        var n = t.memoizedState;
                        if (n !== null) {
                            var i = n.dehydrated;
                            if (oc(l), u)
                                if (l.flags & 256) l.flags &= -257, l = sr(t, l, e);
                                else if (l.memoizedState !== null) l.child = t.child, l.flags |= 128, l = null;
                                else throw Error(s(558));
                            else if (Ot || va(t, l, e, !1), u = (e & t.childLanes) !== 0, Ot || u) {
                                if (a = yt, a !== null && (i = If(a, e), i !== 0 && i !== n.retryLane)) throw n.retryLane = i, qe(t, i), nl(a, t, i), Oc;
                                Bn(), l = sr(t, l, e)
                            } else t = n.treeContext, ht = _l(i.nextSibling), Gt = l, lt = !0, oe = null, Hl = !1, t !== null && $o(l, t), l = zn(l, a), l.flags |= 4096;
                            return l
                        }
                        return t = Zl(t.child, {
                            mode: a.mode,
                            children: a.children
                        }), t.ref = l.ref, l.child = t, t.return = l, t
                    }

                    function Tn(t, l) {
                        var e = l.ref;
                        if (e === null) t !== null && t.ref !== null && (l.flags |= 4194816);
                        else {
                            if (typeof e != "function" && typeof e != "object") throw Error(s(284));
                            (t === null || t.ref !== e) && (l.flags |= 4194816)
                        }
                    }

                    function Uc(t, l, e, a, u) {
                        return Qe(l), e = rc(t, l, e, a, void 0, u), a = dc(), t !== null && !Ot ? (mc(t, l, u), Wl(t, l, u)) : (lt && a && Ji(l), l.flags |= 1, Qt(t, l, e, u), l.child)
                    }

                    function rr(t, l, e, a, u, n) {
                        return Qe(l), l.updateQueue = null, e = ys(l, a, e, u), ms(t), a = dc(), t !== null && !Ot ? (mc(t, l, n), Wl(t, l, n)) : (lt && a && Ji(l), l.flags |= 1, Qt(t, l, e, n), l.child)
                    }

                    function dr(t, l, e, a, u) {
                        if (Qe(l), l.stateNode === null) {
                            var n = da,
                                i = e.contextType;
                            typeof i == "object" && i !== null && (n = Xt(i)), n = new e(a, n), l.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = _c, l.stateNode = n, n._reactInternals = l, n = l.stateNode, n.props = a, n.state = l.memoizedState, n.refs = {}, ac(l), i = e.contextType, n.context = typeof i == "object" && i !== null ? Xt(i) : da, n.state = l.memoizedState, i = e.getDerivedStateFromProps, typeof i == "function" && (Mc(l, e, i, a), n.state = l.memoizedState), typeof e.getDerivedStateFromProps == "function" || typeof n.getSnapshotBeforeUpdate == "function" || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (i = n.state, typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(), i !== n.state && _c.enqueueReplaceState(n, n.state, null), fu(l, a, n, u), cu(), n.state = l.memoizedState), typeof n.componentDidMount == "function" && (l.flags |= 4194308), a = !0
                        } else if (t === null) {
                            n = l.stateNode;
                            var c = l.memoizedProps,
                                o = we(e, c);
                            n.props = o;
                            var v = n.context,
                                z = e.contextType;
                            i = da, typeof z == "object" && z !== null && (i = Xt(z));
                            var H = e.getDerivedStateFromProps;
                            z = typeof H == "function" || typeof n.getSnapshotBeforeUpdate == "function", c = l.pendingProps !== c, z || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (c || v !== i) && Ps(l, n, a, i), de = !1;
                            var g = l.memoizedState;
                            n.state = g, fu(l, a, n, u), cu(), v = l.memoizedState, c || g !== v || de ? (typeof H == "function" && (Mc(l, e, H, a), v = l.memoizedState), (o = de || Fs(l, e, o, a, g, v, i)) ? (z || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()), typeof n.componentDidMount == "function" && (l.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (l.flags |= 4194308), l.memoizedProps = a, l.memoizedState = v), n.props = a, n.state = v, n.context = i, a = o) : (typeof n.componentDidMount == "function" && (l.flags |= 4194308), a = !1)
                        } else {
                            n = l.stateNode, uc(t, l), i = l.memoizedProps, z = we(e, i), n.props = z, H = l.pendingProps, g = n.context, v = e.contextType, o = da, typeof v == "object" && v !== null && (o = Xt(v)), c = e.getDerivedStateFromProps, (v = typeof c == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (i !== H || g !== o) && Ps(l, n, a, o), de = !1, g = l.memoizedState, n.state = g, fu(l, a, n, u), cu();
                            var x = l.memoizedState;
                            i !== H || g !== x || de || t !== null && t.dependencies !== null && un(t.dependencies) ? (typeof c == "function" && (Mc(l, e, c, a), x = l.memoizedState), (z = de || Fs(l, e, z, a, g, x, o) || t !== null && t.dependencies !== null && un(t.dependencies)) ? (v || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(a, x, o), typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(a, x, o)), typeof n.componentDidUpdate == "function" && (l.flags |= 4), typeof n.getSnapshotBeforeUpdate == "function" && (l.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || i === t.memoizedProps && g === t.memoizedState || (l.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || i === t.memoizedProps && g === t.memoizedState || (l.flags |= 1024), l.memoizedProps = a, l.memoizedState = x), n.props = a, n.state = x, n.context = o, a = z) : (typeof n.componentDidUpdate != "function" || i === t.memoizedProps && g === t.memoizedState || (l.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || i === t.memoizedProps && g === t.memoizedState || (l.flags |= 1024), a = !1)
                        }
                        return n = a, Tn(t, l), a = (l.flags & 128) !== 0, n || a ? (n = l.stateNode, e = a && typeof e.getDerivedStateFromError != "function" ? null : n.render(), l.flags |= 1, t !== null && a ? (l.child = Ke(l, t.child, null, u), l.child = Ke(l, null, e, u)) : Qt(t, l, e, u), l.memoizedState = n.state, t = l.child) : t = Wl(t, l, u), t
                    }

                    function mr(t, l, e, a) {
                        return Ge(), l.flags |= 256, Qt(t, l, e, a), l.child
                    }
                    var jc = {
                        dehydrated: null,
                        treeContext: null,
                        retryLane: 0,
                        hydrationErrors: null
                    };

                    function Cc(t) {
                        return {
                            baseLanes: t,
                            cachePool: es()
                        }
                    }

                    function Bc(t, l, e) {
                        return t = t !== null ? t.childLanes & ~e : 0, l && (t |= hl), t
                    }

                    function yr(t, l, e) {
                        var a = l.pendingProps,
                            u = !1,
                            n = (l.flags & 128) !== 0,
                            i;
                        if ((i = n) || (i = t !== null && t.memoizedState === null ? !1 : (At.current & 2) !== 0), i && (u = !0, l.flags &= -129), i = (l.flags & 32) !== 0, l.flags &= -33, t === null) {
                            if (lt) {
                                if (u ? he(l) : ve(), (t = ht) ? (t = Ed(t, Hl), t = t !== null && t.data !== "&" ? t : null, t !== null && (l.memoizedState = {
                                    dehydrated: t,
                                    treeContext: fe !== null ? {
                                        id: Bl,
                                        overflow: Rl
                                    } : null,
                                    retryLane: 536870912,
                                    hydrationErrors: null
                                }, e = wo(t), e.return = l, l.child = e, Gt = l, ht = null)) : t = null, t === null) throw se(l);
                                return gf(t) ? l.lanes = 32 : l.lanes = 536870912, null
                            }
                            var c = a.children;
                            return a = a.fallback, u ? (ve(), u = l.mode, c = An({
                                mode: "hidden",
                                children: c
                            }, u), a = Ye(a, u, e, null), c.return = l, a.return = l, c.sibling = a, l.child = c, a = l.child, a.memoizedState = Cc(e), a.childLanes = Bc(t, i, e), l.memoizedState = jc, mu(null, a)) : (he(l), Rc(l, c))
                        }
                        var o = t.memoizedState;
                        if (o !== null && (c = o.dehydrated, c !== null)) {
                            if (n) l.flags & 256 ? (he(l), l.flags &= -257, l = Nc(t, l, e)) : l.memoizedState !== null ? (ve(), l.child = t.child, l.flags |= 128, l = null) : (ve(), c = a.fallback, u = l.mode, a = An({
                                mode: "visible",
                                children: a.children
                            }, u), c = Ye(c, u, e, null), c.flags |= 2, a.return = l, c.return = l, a.sibling = c, l.child = a, Ke(l, t.child, null, e), a = l.child, a.memoizedState = Cc(e), a.childLanes = Bc(t, i, e), l.memoizedState = jc, l = mu(null, a));
                            else if (he(l), gf(c)) {
                                if (i = c.nextSibling && c.nextSibling.dataset, i) var v = i.dgst;
                                i = v, a = Error(s(419)), a.stack = "", a.digest = i, lu({
                                    value: a,
                                    source: null,
                                    stack: null
                                }), l = Nc(t, l, e)
                            } else if (Ot || va(t, l, e, !1), i = (e & t.childLanes) !== 0, Ot || i) {
                                if (i = yt, i !== null && (a = If(i, e), a !== 0 && a !== o.retryLane)) throw o.retryLane = a, qe(t, a), nl(i, t, a), Oc;
                                vf(c) || Bn(), l = Nc(t, l, e)
                            } else vf(c) ? (l.flags |= 192, l.child = t.child, l = null) : (t = o.treeContext, ht = _l(c.nextSibling), Gt = l, lt = !0, oe = null, Hl = !1, t !== null && $o(l, t), l = Rc(l, a.children), l.flags |= 4096);
                            return l
                        }
                        return u ? (ve(), c = a.fallback, u = l.mode, o = t.child, v = o.sibling, a = Zl(o, {
                            mode: "hidden",
                            children: a.children
                        }), a.subtreeFlags = o.subtreeFlags & 65011712, v !== null ? c = Zl(v, c) : (c = Ye(c, u, e, null), c.flags |= 2), c.return = l, a.return = l, a.sibling = c, l.child = a, mu(null, a), a = l.child, c = t.child.memoizedState, c === null ? c = Cc(e) : (u = c.cachePool, u !== null ? (o = _t._currentValue, u = u.parent !== o ? {
                            parent: o,
                            pool: o
                        } : u) : u = es(), c = {
                            baseLanes: c.baseLanes | e,
                            cachePool: u
                        }), a.memoizedState = c, a.childLanes = Bc(t, i, e), l.memoizedState = jc, mu(t.child, a)) : (he(l), e = t.child, t = e.sibling, e = Zl(e, {
                            mode: "visible",
                            children: a.children
                        }), e.return = l, e.sibling = null, t !== null && (i = l.deletions, i === null ? (l.deletions = [t], l.flags |= 16) : i.push(t)), l.child = e, l.memoizedState = null, e)
                    }

                    function Rc(t, l) {
                        return l = An({
                            mode: "visible",
                            children: l
                        }, t.mode), l.return = t, t.child = l
                    }

                    function An(t, l) {
                        return t = rl(22, t, null, l), t.lanes = 0, t
                    }

                    function Nc(t, l, e) {
                        return Ke(l, t.child, null, e), t = Rc(l, l.pendingProps.children), t.flags |= 2, l.memoizedState = null, t
                    }

                    function hr(t, l, e) {
                        t.lanes |= l;
                        var a = t.alternate;
                        a !== null && (a.lanes |= l), Fi(t.return, l, e)
                    }

                    function qc(t, l, e, a, u, n) {
                        var i = t.memoizedState;
                        i === null ? t.memoizedState = {
                            isBackwards: l,
                            rendering: null,
                            renderingStartTime: 0,
                            last: a,
                            tail: e,
                            tailMode: u,
                            treeForkCount: n
                        } : (i.isBackwards = l, i.rendering = null, i.renderingStartTime = 0, i.last = a, i.tail = e, i.tailMode = u, i.treeForkCount = n)
                    }

                    function vr(t, l, e) {
                        var a = l.pendingProps,
                            u = a.revealOrder,
                            n = a.tail;
                        a = a.children;
                        var i = At.current,
                            c = (i & 2) !== 0;
                        if (c ? (i = i & 1 | 2, l.flags |= 128) : i &= 1, _(At, i), Qt(t, l, a, e), a = lt ? tu : 0, !c && t !== null && (t.flags & 128) !== 0) t: for (t = l.child; t !== null;) {
                            if (t.tag === 13) t.memoizedState !== null && hr(t, e, l);
                            else if (t.tag === 19) hr(t, e, l);
                            else if (t.child !== null) {
                                t.child.return = t, t = t.child;
                                continue
                            }
                            if (t === l) break t;
                            for (; t.sibling === null;) {
                                if (t.return === null || t.return === l) break t;
                                t = t.return
                            }
                            t.sibling.return = t.return, t = t.sibling
                        }
                        switch (u) {
                            case "forwards":
                                for (e = l.child, u = null; e !== null;) t = e.alternate, t !== null && mn(t) === null && (u = e), e = e.sibling;
                                e = u, e === null ? (u = l.child, l.child = null) : (u = e.sibling, e.sibling = null), qc(l, !1, u, e, n, a);
                                break;
                            case "backwards":
                            case "unstable_legacy-backwards":
                                for (e = null, u = l.child, l.child = null; u !== null;) {
                                    if (t = u.alternate, t !== null && mn(t) === null) {
                                        l.child = u;
                                        break
                                    }
                                    t = u.sibling, u.sibling = e, e = u, u = t
                                }
                                qc(l, !0, e, null, n, a);
                                break;
                            case "together":
                                qc(l, !1, null, null, void 0, a);
                                break;
                            default:
                                l.memoizedState = null
                        }
                        return l.child
                    }

                    function Wl(t, l, e) {
                        if (t !== null && (l.dependencies = t.dependencies), be |= l.lanes, (e & l.childLanes) === 0)
                            if (t !== null) {
                                if (va(t, l, e, !1), (e & l.childLanes) === 0) return null
                            } else return null;
                        if (t !== null && l.child !== t.child) throw Error(s(153));
                        if (l.child !== null) {
                            for (t = l.child, e = Zl(t, t.pendingProps), l.child = e, e.return = l; t.sibling !== null;) t = t.sibling, e = e.sibling = Zl(t, t.pendingProps), e.return = l;
                            e.sibling = null
                        }
                        return l.child
                    }

                    function Yc(t, l) {
                        return (t.lanes & l) !== 0 ? !0 : (t = t.dependencies, !!(t !== null && un(t)))
                    }

                    function fy(t, l, e) {
                        switch (l.tag) {
                            case 3:
                                $t(l, l.stateNode.containerInfo), re(l, _t, t.memoizedState.cache), Ge();
                                break;
                            case 27:
                            case 5:
                                Ga(l);
                                break;
                            case 4:
                                $t(l, l.stateNode.containerInfo);
                                break;
                            case 10:
                                re(l, l.type, l.memoizedProps.value);
                                break;
                            case 31:
                                if (l.memoizedState !== null) return l.flags |= 128, oc(l), null;
                                break;
                            case 13:
                                var a = l.memoizedState;
                                if (a !== null) return a.dehydrated !== null ? (he(l), l.flags |= 128, null) : (e & l.child.childLanes) !== 0 ? yr(t, l, e) : (he(l), t = Wl(t, l, e), t !== null ? t.sibling : null);
                                he(l);
                                break;
                            case 19:
                                var u = (t.flags & 128) !== 0;
                                if (a = (e & l.childLanes) !== 0, a || (va(t, l, e, !1), a = (e & l.childLanes) !== 0), u) {
                                    if (a) return vr(t, l, e);
                                    l.flags |= 128
                                }
                                if (u = l.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), _(At, At.current), a) break;
                                return null;
                            case 22:
                                return l.lanes = 0, fr(t, l, e, l.pendingProps);
                            case 24:
                                re(l, _t, t.memoizedState.cache)
                        }
                        return Wl(t, l, e)
                    }

                    function gr(t, l, e) {
                        if (t !== null)
                            if (t.memoizedProps !== l.pendingProps) Ot = !0;
                            else {
                                if (!Yc(t, e) && (l.flags & 128) === 0) return Ot = !1, fy(t, l, e);
                                Ot = (t.flags & 131072) !== 0
                            }
                        else Ot = !1, lt && (l.flags & 1048576) !== 0 && ko(l, tu, l.index);
                        switch (l.lanes = 0, l.tag) {
                            case 16:
                                t: {
                                    var a = l.pendingProps;
                                    if (t = Le(l.elementType), l.type = t, typeof t == "function") Li(t) ? (a = we(t, a), l.tag = 1, l = dr(null, l, t, a, e)) : (l.tag = 0, l = Uc(null, l, t, a, e));
                                    else {
                                        if (t != null) {
                                            var u = t.$$typeof;
                                            if (u === Kt) {
                                                l.tag = 11, l = nr(null, l, t, a, e);
                                                break t
                                            } else if (u === P) {
                                                l.tag = 14, l = ir(null, l, t, a, e);
                                                break t
                                            }
                                        }
                                        throw l = il(t) || t, Error(s(306, l, ""))
                                    }
                                }
                                return l;
                            case 0:
                                return Uc(t, l, l.type, l.pendingProps, e);
                            case 1:
                                return a = l.type, u = we(a, l.pendingProps), dr(t, l, a, u, e);
                            case 3:
                                t: {
                                    if ($t(l, l.stateNode.containerInfo), t === null) throw Error(s(387));a = l.pendingProps;
                                    var n = l.memoizedState;u = n.element,
                                        uc(t, l),
                                        fu(l, a, null, e);
                                    var i = l.memoizedState;
                                    if (a = i.cache, re(l, _t, a), a !== n.cache && Pi(l, [_t], e, !0), cu(), a = i.element, n.isDehydrated)
                                        if (n = {
                                            element: a,
                                            isDehydrated: !1,
                                            cache: i.cache
                                        }, l.updateQueue.baseState = n, l.memoizedState = n, l.flags & 256) {
                                            l = mr(t, l, a, e);
                                            break t
                                        } else if (a !== u) {
                                            u = zl(Error(s(424)), l), lu(u), l = mr(t, l, a, e);
                                            break t
                                        } else
                                            for (t = l.stateNode.containerInfo, t.nodeType === 9 ? t = t.body : t = t.nodeName === "HTML" ? t.ownerDocument.body : t, ht = _l(t.firstChild), Gt = l, lt = !0, oe = null, Hl = !0, e = fs(l, null, a, e), l.child = e; e;) e.flags = e.flags & -3 | 4096, e = e.sibling;
                                    else {
                                        if (Ge(), a === u) {
                                            l = Wl(t, l, e);
                                            break t
                                        }
                                        Qt(t, l, a, e)
                                    }
                                    l = l.child
                                }
                                return l;
                            case 26:
                                return Tn(t, l), t === null ? (e = _d(l.type, null, l.pendingProps, null)) ? l.memoizedState = e : lt || (e = l.type, t = l.pendingProps, a = Qn(k.current).createElement(e), a[Yt] = l, a[It] = t, Zt(a, e, t), Bt(a), l.stateNode = a) : l.memoizedState = _d(l.type, t.memoizedProps, l.pendingProps, t.memoizedState), null;
                            case 27:
                                return Ga(l), t === null && lt && (a = l.stateNode = Ad(l.type, l.pendingProps, k.current), Gt = l, Hl = !0, u = ht, Te(l.type) ? (pf = u, ht = _l(a.firstChild)) : ht = u), Qt(t, l, l.pendingProps.children, e), Tn(t, l), t === null && (l.flags |= 4194304), l.child;
                            case 5:
                                return t === null && lt && ((u = a = ht) && (a = Yy(a, l.type, l.pendingProps, Hl), a !== null ? (l.stateNode = a, Gt = l, ht = _l(a.firstChild), Hl = !1, u = !0) : u = !1), u || se(l)), Ga(l), u = l.type, n = l.pendingProps, i = t !== null ? t.memoizedProps : null, a = n.children, mf(u, n) ? a = null : i !== null && mf(u, i) && (l.flags |= 32), l.memoizedState !== null && (u = rc(t, l, Im, null, null, e), _u._currentValue = u), Tn(t, l), Qt(t, l, a, e), l.child;
                            case 6:
                                return t === null && lt && ((t = e = ht) && (e = Gy(e, l.pendingProps, Hl), e !== null ? (l.stateNode = e, Gt = l, ht = null, t = !0) : t = !1), t || se(l)), null;
                            case 13:
                                return yr(t, l, e);
                            case 4:
                                return $t(l, l.stateNode.containerInfo), a = l.pendingProps, t === null ? l.child = Ke(l, null, a, e) : Qt(t, l, a, e), l.child;
                            case 11:
                                return nr(t, l, l.type, l.pendingProps, e);
                            case 7:
                                return Qt(t, l, l.pendingProps, e), l.child;
                            case 8:
                                return Qt(t, l, l.pendingProps.children, e), l.child;
                            case 12:
                                return Qt(t, l, l.pendingProps.children, e), l.child;
                            case 10:
                                return a = l.pendingProps, re(l, l.type, a.value), Qt(t, l, a.children, e), l.child;
                            case 9:
                                return u = l.type._context, a = l.pendingProps.children, Qe(l), u = Xt(u), a = a(u), l.flags |= 1, Qt(t, l, a, e), l.child;
                            case 14:
                                return ir(t, l, l.type, l.pendingProps, e);
                            case 15:
                                return cr(t, l, l.type, l.pendingProps, e);
                            case 19:
                                return vr(t, l, e);
                            case 31:
                                return cy(t, l, e);
                            case 22:
                                return fr(t, l, e, l.pendingProps);
                            case 24:
                                return Qe(l), a = Xt(_t), t === null ? (u = lc(), u === null && (u = yt, n = Ii(), u.pooledCache = n, n.refCount++, n !== null && (u.pooledCacheLanes |= e), u = n), l.memoizedState = {
                                    parent: a,
                                    cache: u
                                }, ac(l), re(l, _t, u)) : ((t.lanes & e) !== 0 && (uc(t, l), fu(l, null, null, e), cu()), u = t.memoizedState, n = l.memoizedState, u.parent !== a ? (u = {
                                    parent: a,
                                    cache: a
                                }, l.memoizedState = u, l.lanes === 0 && (l.memoizedState = l.updateQueue.baseState = u), re(l, _t, a)) : (a = n.cache, re(l, _t, a), a !== u.cache && Pi(l, [_t], e, !0))), Qt(t, l, l.pendingProps.children, e), l.child;
                            case 29:
                                throw l.pendingProps
                        }
                        throw Error(s(156, l.tag))
                    }

                    function kl(t) {
                        t.flags |= 4
                    }

                    function Gc(t, l, e, a, u) {
                        if ((l = (t.mode & 32) !== 0) && (l = !1), l) {
                            if (t.flags |= 16777216, (u & 335544128) === u)
                                if (t.stateNode.complete) t.flags |= 8192;
                                else if (Vr()) t.flags |= 8192;
                                else throw Ve = on, ec
                        } else t.flags &= -16777217
                    }

                    function pr(t, l) {
                        if (l.type !== "stylesheet" || (l.state.loading & 4) !== 0) t.flags &= -16777217;
                        else if (t.flags |= 16777216, !Cd(l))
                            if (Vr()) t.flags |= 8192;
                            else throw Ve = on, ec
                    }

                    function Hn(t, l) {
                        l !== null && (t.flags |= 4), t.flags & 16384 && (l = t.tag !== 22 ? $f() : 536870912, t.lanes |= l, _a |= l)
                    }

                    function yu(t, l) {
                        if (!lt) switch (t.tailMode) {
                            case "hidden":
                                l = t.tail;
                                for (var e = null; l !== null;) l.alternate !== null && (e = l), l = l.sibling;
                                e === null ? t.tail = null : e.sibling = null;
                                break;
                            case "collapsed":
                                e = t.tail;
                                for (var a = null; e !== null;) e.alternate !== null && (a = e), e = e.sibling;
                                a === null ? l || t.tail === null ? t.tail = null : t.tail.sibling = null : a.sibling = null
                        }
                    }

                    function vt(t) {
                        var l = t.alternate !== null && t.alternate.child === t.child,
                            e = 0,
                            a = 0;
                        if (l)
                            for (var u = t.child; u !== null;) e |= u.lanes | u.childLanes, a |= u.subtreeFlags & 65011712, a |= u.flags & 65011712, u.return = t, u = u.sibling;
                        else
                            for (u = t.child; u !== null;) e |= u.lanes | u.childLanes, a |= u.subtreeFlags, a |= u.flags, u.return = t, u = u.sibling;
                        return t.subtreeFlags |= a, t.childLanes = e, l
                    }

                    function oy(t, l, e) {
                        var a = l.pendingProps;
                        switch (wi(l), l.tag) {
                            case 16:
                            case 15:
                            case 0:
                            case 11:
                            case 7:
                            case 8:
                            case 12:
                            case 9:
                            case 14:
                                return vt(l), null;
                            case 1:
                                return vt(l), null;
                            case 3:
                                return e = l.stateNode, a = null, t !== null && (a = t.memoizedState.cache), l.memoizedState.cache !== a && (l.flags |= 2048), Kl(_t), Tt(), e.pendingContext && (e.context = e.pendingContext, e.pendingContext = null), (t === null || t.child === null) && (ha(l) ? kl(l) : t === null || t.memoizedState.isDehydrated && (l.flags & 256) === 0 || (l.flags |= 1024, ki())), vt(l), null;
                            case 26:
                                var u = l.type,
                                    n = l.memoizedState;
                                return t === null ? (kl(l), n !== null ? (vt(l), pr(l, n)) : (vt(l), Gc(l, u, null, a, e))) : n ? n !== t.memoizedState ? (kl(l), vt(l), pr(l, n)) : (vt(l), l.flags &= -16777217) : (t = t.memoizedProps, t !== a && kl(l), vt(l), Gc(l, u, t, a, e)), null;
                            case 27:
                                if (Nu(l), e = k.current, u = l.type, t !== null && l.stateNode != null) t.memoizedProps !== a && kl(l);
                                else {
                                    if (!a) {
                                        if (l.stateNode === null) throw Error(s(166));
                                        return vt(l), null
                                    }
                                    t = N.current, ha(l) ? Fo(l) : (t = Ad(u, a, e), l.stateNode = t, kl(l))
                                }
                                return vt(l), null;
                            case 5:
                                if (Nu(l), u = l.type, t !== null && l.stateNode != null) t.memoizedProps !== a && kl(l);
                                else {
                                    if (!a) {
                                        if (l.stateNode === null) throw Error(s(166));
                                        return vt(l), null
                                    }
                                    if (n = N.current, ha(l)) Fo(l);
                                    else {
                                        var i = Qn(k.current);
                                        switch (n) {
                                            case 1:
                                                n = i.createElementNS("http://www.w3.org/2000/svg", u);
                                                break;
                                            case 2:
                                                n = i.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                                                break;
                                            default:
                                                switch (u) {
                                                    case "svg":
                                                        n = i.createElementNS("http://www.w3.org/2000/svg", u);
                                                        break;
                                                    case "math":
                                                        n = i.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                                                        break;
                                                    case "script":
                                                        n = i.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild);
                                                        break;
                                                    case "select":
                                                        n = typeof a.is == "string" ? i.createElement("select", {
                                                            is: a.is
                                                        }) : i.createElement("select"), a.multiple ? n.multiple = !0 : a.size && (n.size = a.size);
                                                        break;
                                                    default:
                                                        n = typeof a.is == "string" ? i.createElement(u, {
                                                            is: a.is
                                                        }) : i.createElement(u)
                                                }
                                        }
                                        n[Yt] = l, n[It] = a;
                                        t: for (i = l.child; i !== null;) {
                                            if (i.tag === 5 || i.tag === 6) n.appendChild(i.stateNode);
                                            else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                                                i.child.return = i, i = i.child;
                                                continue
                                            }
                                            if (i === l) break t;
                                            for (; i.sibling === null;) {
                                                if (i.return === null || i.return === l) break t;
                                                i = i.return
                                            }
                                            i.sibling.return = i.return, i = i.sibling
                                        }
                                        l.stateNode = n;
                                        t: switch (Zt(n, u, a), u) {
                                            case "button":
                                            case "input":
                                            case "select":
                                            case "textarea":
                                                a = !!a.autoFocus;
                                                break t;
                                            case "img":
                                                a = !0;
                                                break t;
                                            default:
                                                a = !1
                                        }
                                        a && kl(l)
                                    }
                                }
                                return vt(l), Gc(l, l.type, t === null ? null : t.memoizedProps, l.pendingProps, e), null;
                            case 6:
                                if (t && l.stateNode != null) t.memoizedProps !== a && kl(l);
                                else {
                                    if (typeof a != "string" && l.stateNode === null) throw Error(s(166));
                                    if (t = k.current, ha(l)) {
                                        if (t = l.stateNode, e = l.memoizedProps, a = null, u = Gt, u !== null) switch (u.tag) {
                                            case 27:
                                            case 5:
                                                a = u.memoizedProps
                                        }
                                        t[Yt] = l, t = !!(t.nodeValue === e || a !== null && a.suppressHydrationWarning === !0 || yd(t.nodeValue, e)), t || se(l, !0)
                                    } else t = Qn(t).createTextNode(a), t[Yt] = l, l.stateNode = t
                                }
                                return vt(l), null;
                            case 31:
                                if (e = l.memoizedState, t === null || t.memoizedState !== null) {
                                    if (a = ha(l), e !== null) {
                                        if (t === null) {
                                            if (!a) throw Error(s(318));
                                            if (t = l.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(s(557));
                                            t[Yt] = l
                                        } else Ge(), (l.flags & 128) === 0 && (l.memoizedState = null), l.flags |= 4;
                                        vt(l), t = !1
                                    } else e = ki(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = e), t = !0;
                                    if (!t) return l.flags & 256 ? (ml(l), l) : (ml(l), null);
                                    if ((l.flags & 128) !== 0) throw Error(s(558))
                                }
                                return vt(l), null;
                            case 13:
                                if (a = l.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
                                    if (u = ha(l), a !== null && a.dehydrated !== null) {
                                        if (t === null) {
                                            if (!u) throw Error(s(318));
                                            if (u = l.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(s(317));
                                            u[Yt] = l
                                        } else Ge(), (l.flags & 128) === 0 && (l.memoizedState = null), l.flags |= 4;
                                        vt(l), u = !1
                                    } else u = ki(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = u), u = !0;
                                    if (!u) return l.flags & 256 ? (ml(l), l) : (ml(l), null)
                                }
                                return ml(l), (l.flags & 128) !== 0 ? (l.lanes = e, l) : (e = a !== null, t = t !== null && t.memoizedState !== null, e && (a = l.child, u = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (u = a.alternate.memoizedState.cachePool.pool), n = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (n = a.memoizedState.cachePool.pool), n !== u && (a.flags |= 2048)), e !== t && e && (l.child.flags |= 8192), Hn(l, l.updateQueue), vt(l), null);
                            case 4:
                                return Tt(), t === null && ff(l.stateNode.containerInfo), vt(l), null;
                            case 10:
                                return Kl(l.type), vt(l), null;
                            case 19:
                                if (T(At), a = l.memoizedState, a === null) return vt(l), null;
                                if (u = (l.flags & 128) !== 0, n = a.rendering, n === null)
                                    if (u) yu(a, !1);
                                    else {
                                        if (zt !== 0 || t !== null && (t.flags & 128) !== 0)
                                            for (t = l.child; t !== null;) {
                                                if (n = mn(t), n !== null) {
                                                    for (l.flags |= 128, yu(a, !1), t = n.updateQueue, l.updateQueue = t, Hn(l, t), l.subtreeFlags = 0, t = e, e = l.child; e !== null;) Jo(e, t), e = e.sibling;
                                                    return _(At, At.current & 1 | 2), lt && Ll(l, a.treeForkCount), l.child
                                                }
                                                t = t.sibling
                                            }
                                        a.tail !== null && cl() > Un && (l.flags |= 128, u = !0, yu(a, !1), l.lanes = 4194304)
                                    }
                                else {
                                    if (!u)
                                        if (t = mn(n), t !== null) {
                                            if (l.flags |= 128, u = !0, t = t.updateQueue, l.updateQueue = t, Hn(l, t), yu(a, !0), a.tail === null && a.tailMode === "hidden" && !n.alternate && !lt) return vt(l), null
                                        } else 2 * cl() - a.renderingStartTime > Un && e !== 536870912 && (l.flags |= 128, u = !0, yu(a, !1), l.lanes = 4194304);
                                    a.isBackwards ? (n.sibling = l.child, l.child = n) : (t = a.last, t !== null ? t.sibling = n : l.child = n, a.last = n)
                                }
                                return a.tail !== null ? (t = a.tail, a.rendering = t, a.tail = t.sibling, a.renderingStartTime = cl(), t.sibling = null, e = At.current, _(At, u ? e & 1 | 2 : e & 1), lt && Ll(l, a.treeForkCount), t) : (vt(l), null);
                            case 22:
                            case 23:
                                return ml(l), fc(), a = l.memoizedState !== null, t !== null ? t.memoizedState !== null !== a && (l.flags |= 8192) : a && (l.flags |= 8192), a ? (e & 536870912) !== 0 && (l.flags & 128) === 0 && (vt(l), l.subtreeFlags & 6 && (l.flags |= 8192)) : vt(l), e = l.updateQueue, e !== null && Hn(l, e.retryQueue), e = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), a = null, l.memoizedState !== null && l.memoizedState.cachePool !== null && (a = l.memoizedState.cachePool.pool), a !== e && (l.flags |= 2048), t !== null && T(Ze), null;
                            case 24:
                                return e = null, t !== null && (e = t.memoizedState.cache), l.memoizedState.cache !== e && (l.flags |= 2048), Kl(_t), vt(l), null;
                            case 25:
                                return null;
                            case 30:
                                return null
                        }
                        throw Error(s(156, l.tag))
                    }

                    function sy(t, l) {
                        switch (wi(l), l.tag) {
                            case 1:
                                return t = l.flags, t & 65536 ? (l.flags = t & -65537 | 128, l) : null;
                            case 3:
                                return Kl(_t), Tt(), t = l.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (l.flags = t & -65537 | 128, l) : null;
                            case 26:
                            case 27:
                            case 5:
                                return Nu(l), null;
                            case 31:
                                if (l.memoizedState !== null) {
                                    if (ml(l), l.alternate === null) throw Error(s(340));
                                    Ge()
                                }
                                return t = l.flags, t & 65536 ? (l.flags = t & -65537 | 128, l) : null;
                            case 13:
                                if (ml(l), t = l.memoizedState, t !== null && t.dehydrated !== null) {
                                    if (l.alternate === null) throw Error(s(340));
                                    Ge()
                                }
                                return t = l.flags, t & 65536 ? (l.flags = t & -65537 | 128, l) : null;
                            case 19:
                                return T(At), null;
                            case 4:
                                return Tt(), null;
                            case 10:
                                return Kl(l.type), null;
                            case 22:
                            case 23:
                                return ml(l), fc(), t !== null && T(Ze), t = l.flags, t & 65536 ? (l.flags = t & -65537 | 128, l) : null;
                            case 24:
                                return Kl(_t), null;
                            case 25:
                                return null;
                            default:
                                return null
                        }
                    }

                    function br(t, l) {
                        switch (wi(l), l.tag) {
                            case 3:
                                Kl(_t), Tt();
                                break;
                            case 26:
                            case 27:
                            case 5:
                                Nu(l);
                                break;
                            case 4:
                                Tt();
                                break;
                            case 31:
                                l.memoizedState !== null && ml(l);
                                break;
                            case 13:
                                ml(l);
                                break;
                            case 19:
                                T(At);
                                break;
                            case 10:
                                Kl(l.type);
                                break;
                            case 22:
                            case 23:
                                ml(l), fc(), t !== null && T(Ze);
                                break;
                            case 24:
                                Kl(_t)
                        }
                    }

                    function hu(t, l) {
                        try {
                            var e = l.updateQueue,
                                a = e !== null ? e.lastEffect : null;
                            if (a !== null) {
                                var u = a.next;
                                e = u;
                                do {
                                    if ((e.tag & t) === t) {
                                        a = void 0;
                                        var n = e.create,
                                            i = e.inst;
                                        a = n(), i.destroy = a
                                    }
                                    e = e.next
                                } while (e !== u)
                            }
                            } catch (c) {
                                ot(l, l.return, c)
                            }
                        }

                        function ge(t, l, e) {
                            try {
                                var a = l.updateQueue,
                                    u = a !== null ? a.lastEffect : null;
                                if (u !== null) {
                                    var n = u.next;
                                    a = n;
                                    do {
                                        if ((a.tag & t) === t) {
                                            var i = a.inst,
                                                c = i.destroy;
                                            if (c !== void 0) {
                                                i.destroy = void 0, u = l;
                                                var o = e,
                                                    v = c;
                                                try {
                                                    v()
                                                } catch (z) {
                                                    ot(u, o, z)
                                                }
                                            }
                                        }
                                        a = a.next
                                    } while (a !== n)
                                }
                                } catch (z) {
                                    ot(l, l.return, z)
                                }
                            }

                            function Sr(t) {
                                var l = t.updateQueue;
                                if (l !== null) {
                                    var e = t.stateNode;
                                    try {
                                        ss(l, e)
                                    } catch (a) {
                                        ot(t, t.return, a)
                                    }
                                }
                            }

                            function xr(t, l, e) {
                                e.props = we(t.type, t.memoizedProps), e.state = t.memoizedState;
                                try {
                                    e.componentWillUnmount()
                                } catch (a) {
                                    ot(t, l, a)
                                }
                            }

                            function vu(t, l) {
                                try {
                                    var e = t.ref;
                                    if (e !== null) {
                                        switch (t.tag) {
                                            case 26:
                                            case 27:
                                            case 5:
                                                var a = t.stateNode;
                                                break;
                                            case 30:
                                                a = t.stateNode;
                                                break;
                                            default:
                                                a = t.stateNode
                                        }
                                        typeof e == "function" ? t.refCleanup = e(a) : e.current = a
                                    }
                                } catch (u) {
                                    ot(t, l, u)
                                }
                            }

                            function Nl(t, l) {
                                var e = t.ref,
                                    a = t.refCleanup;
                                if (e !== null)
                                    if (typeof a == "function") try {
                                        a()
                                    } catch (u) {
                                        ot(t, l, u)
                                    } finally {
                                        t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null)
                                    } else if (typeof e == "function") try {
                                        e(null)
                                    } catch (u) {
                                        ot(t, l, u)
                                    } else e.current = null
                            }

                            function Er(t) {
                                var l = t.type,
                                    e = t.memoizedProps,
                                    a = t.stateNode;
                                try {
                                    t: switch (l) {
                                        case "button":
                                        case "input":
                                        case "select":
                                        case "textarea":
                                            e.autoFocus && a.focus();
                                            break t;
                                        case "img":
                                            e.src ? a.src = e.src : e.srcSet && (a.srcset = e.srcSet)
                                    }
                                }
                                catch (u) {
                                    ot(t, t.return, u)
                                }
                            }

                            function Xc(t, l, e) {
                                try {
                                    var a = t.stateNode;
                                    jy(a, t.type, e, l), a[It] = l
                                } catch (u) {
                                    ot(t, t.return, u)
                                }
                            }

                            function zr(t) {
                                return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && Te(t.type) || t.tag === 4
                            }

                            function Qc(t) {
                                t: for (;;) {
                                    for (; t.sibling === null;) {
                                        if (t.return === null || zr(t.return)) return null;
                                        t = t.return
                                    }
                                    for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18;) {
                                        if (t.tag === 27 && Te(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
                                        t.child.return = t, t = t.child
                                    }
                                    if (!(t.flags & 2)) return t.stateNode
                                }
                            }

                            function Zc(t, l, e) {
                                var a = t.tag;
                                if (a === 5 || a === 6) t = t.stateNode, l ? (e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e).insertBefore(t, l) : (l = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, l.appendChild(t), e = e._reactRootContainer, e != null || l.onclick !== null || (l.onclick = Xl));
                                else if (a !== 4 && (a === 27 && Te(t.type) && (e = t.stateNode, l = null), t = t.child, t !== null))
                                    for (Zc(t, l, e), t = t.sibling; t !== null;) Zc(t, l, e), t = t.sibling
                            }

                            function Mn(t, l, e) {
                                var a = t.tag;
                                if (a === 5 || a === 6) t = t.stateNode, l ? e.insertBefore(t, l) : e.appendChild(t);
                                else if (a !== 4 && (a === 27 && Te(t.type) && (e = t.stateNode), t = t.child, t !== null))
                                    for (Mn(t, l, e), t = t.sibling; t !== null;) Mn(t, l, e), t = t.sibling
                            }

                            function Tr(t) {
                                var l = t.stateNode,
                                    e = t.memoizedProps;
                                try {
                                    for (var a = t.type, u = l.attributes; u.length;) l.removeAttributeNode(u[0]);
                                    Zt(l, a, e), l[Yt] = t, l[It] = e
                                } catch (n) {
                                    ot(t, t.return, n)
                                }
                            }
                            var $l = !1,
                                Ut = !1,
                                Lc = !1,
                                Ar = typeof WeakSet == "function" ? WeakSet : Set,
                                Rt = null;

                            function ry(t, l) {
                                if (t = t.containerInfo, rf = Wn, t = qo(t), Ni(t)) {
                                    if ("selectionStart" in t) var e = {
                                        start: t.selectionStart,
                                        end: t.selectionEnd
                                    };
                                    else t: {
                                        e = (e = t.ownerDocument) && e.defaultView || window;
                                        var a = e.getSelection && e.getSelection();
                                        if (a && a.rangeCount !== 0) {
                                            e = a.anchorNode;
                                            var u = a.anchorOffset,
                                                n = a.focusNode;
                                            a = a.focusOffset;
                                            try {
                                                e.nodeType, n.nodeType
                                            } catch {
                                                e = null;
                                                break t
                                            }
                                            var i = 0,
                                                c = -1,
                                                o = -1,
                                                v = 0,
                                                z = 0,
                                                H = t,
                                                g = null;
                                            l: for (;;) {
                                                for (var x; H !== e || u !== 0 && H.nodeType !== 3 || (c = i + u), H !== n || a !== 0 && H.nodeType !== 3 || (o = i + a), H.nodeType === 3 && (i += H.nodeValue.length), (x = H.firstChild) !== null;) g = H, H = x;
                                                for (;;) {
                                                    if (H === t) break l;
                                                    if (g === e && ++v === u && (c = i), g === n && ++z === a && (o = i), (x = H.nextSibling) !== null) break;
                                                    H = g, g = H.parentNode
                                                }
                                                H = x
                                            }
                                            e = c === -1 || o === -1 ? null : {
                                                start: c,
                                                end: o
                                            }
                                        } else e = null
                                    }
                                    e = e || {
                                        start: 0,
                                        end: 0
                                    }
                                } else e = null;
                                for (df = {
                                    focusedElem: t,
                                    selectionRange: e
                                }, Wn = !1, Rt = l; Rt !== null;)
                                    if (l = Rt, t = l.child, (l.subtreeFlags & 1028) !== 0 && t !== null) t.return = l, Rt = t;
                                    else
                                        for (; Rt !== null;) {
                                            switch (l = Rt, n = l.alternate, t = l.flags, l.tag) {
                                                case 0:
                                                    if ((t & 4) !== 0 && (t = l.updateQueue, t = t !== null ? t.events : null, t !== null))
                                                        for (e = 0; e < t.length; e++) u = t[e], u.ref.impl = u.nextImpl;
                                                    break;
                                                case 11:
                                                case 15:
                                                    break;
                                                case 1:
                                                    if ((t & 1024) !== 0 && n !== null) {
                                                        t = void 0, e = l, u = n.memoizedProps, n = n.memoizedState, a = e.stateNode;
                                                        try {
                                                            var B = we(e.type, u);
                                                            t = a.getSnapshotBeforeUpdate(B, n), a.__reactInternalSnapshotBeforeUpdate = t
                                                        } catch (Q) {
                                                            ot(e, e.return, Q)
                                                        }
                                                    }
                                                    break;
                                                case 3:
                                                    if ((t & 1024) !== 0) {
                                                        if (t = l.stateNode.containerInfo, e = t.nodeType, e === 9) hf(t);
                                                        else if (e === 1) switch (t.nodeName) {
                                                            case "HEAD":
                                                            case "HTML":
                                                            case "BODY":
                                                                hf(t);
                                                                break;
                                                            default:
                                                                t.textContent = ""
                                                        }
                                                    }
                                                    break;
                                                case 5:
                                                case 26:
                                                case 27:
                                                case 6:
                                                case 4:
                                                case 17:
                                                    break;
                                                default:
                                                    if ((t & 1024) !== 0) throw Error(s(163))
                                            }
                                            if (t = l.sibling, t !== null) {
                                                t.return = l.return, Rt = t;
                                                break
                                            }
                                            Rt = l.return
                                        }
                            }

                            function Hr(t, l, e) {
                                var a = e.flags;
                                switch (e.tag) {
                                    case 0:
                                    case 11:
                                    case 15:
                                        Pl(t, e), a & 4 && hu(5, e);
                                        break;
                                    case 1:
                                        if (Pl(t, e), a & 4)
                                            if (t = e.stateNode, l === null) try {
                                                t.componentDidMount()
                                            } catch (i) {
                                                ot(e, e.return, i)
                                            } else {
                                                var u = we(e.type, l.memoizedProps);
                                                l = l.memoizedState;
                                                try {
                                                    t.componentDidUpdate(u, l, t.__reactInternalSnapshotBeforeUpdate)
                                                } catch (i) {
                                                    ot(e, e.return, i)
                                                }
                                            }
                                        a & 64 && Sr(e), a & 512 && vu(e, e.return);
                                        break;
                                    case 3:
                                        if (Pl(t, e), a & 64 && (t = e.updateQueue, t !== null)) {
                                            if (l = null, e.child !== null) switch (e.child.tag) {
                                                case 27:
                                                case 5:
                                                    l = e.child.stateNode;
                                                    break;
                                                case 1:
                                                    l = e.child.stateNode
                                            }
                                            try {
                                                ss(t, l)
                                            } catch (i) {
                                                ot(e, e.return, i)
                                            }
                                        }
                                        break;
                                    case 27:
                                        l === null && a & 4 && Tr(e);
                                    case 26:
                                    case 5:
                                        Pl(t, e), l === null && a & 4 && Er(e), a & 512 && vu(e, e.return);
                                        break;
                                    case 12:
                                        Pl(t, e);
                                        break;
                                    case 31:
                                        Pl(t, e), a & 4 && Dr(t, e);
                                        break;
                                    case 13:
                                        Pl(t, e), a & 4 && Or(t, e), a & 64 && (t = e.memoizedState, t !== null && (t = t.dehydrated, t !== null && (e = Sy.bind(null, e), Xy(t, e))));
                                        break;
                                    case 22:
                                        if (a = e.memoizedState !== null || $l, !a) {
                                            l = l !== null && l.memoizedState !== null || Ut, u = $l;
                                            var n = Ut;
                                            $l = a, (Ut = l) && !n ? Il(t, e, (e.subtreeFlags & 8772) !== 0) : Pl(t, e), $l = u, Ut = n
                                        }
                                        break;
                                    case 30:
                                        break;
                                    default:
                                        Pl(t, e)
                                }
                            }

                            function Mr(t) {
                                var l = t.alternate;
                                l !== null && (t.alternate = null, Mr(l)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (l = t.stateNode, l !== null && bi(l)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null
                            }
                            var pt = null,
                                ll = !1;

                            function Fl(t, l, e) {
                                for (e = e.child; e !== null;) _r(t, l, e), e = e.sibling
                            }

                            function _r(t, l, e) {
                                if (fl && typeof fl.onCommitFiberUnmount == "function") try {
                                    fl.onCommitFiberUnmount(Xa, e)
                                } catch {}
                                switch (e.tag) {
                                    case 26:
                                        Ut || Nl(e, l), Fl(t, l, e), e.memoizedState ? e.memoizedState.count-- : e.stateNode && (e = e.stateNode, e.parentNode.removeChild(e));
                                        break;
                                    case 27:
                                        Ut || Nl(e, l);
                                        var a = pt,
                                            u = ll;
                                        Te(e.type) && (pt = e.stateNode, ll = !1), Fl(t, l, e), Au(e.stateNode), pt = a, ll = u;
                                        break;
                                    case 5:
                                        Ut || Nl(e, l);
                                    case 6:
                                        if (a = pt, u = ll, pt = null, Fl(t, l, e), pt = a, ll = u, pt !== null)
                                            if (ll) try {
                                                (pt.nodeType === 9 ? pt.body : pt.nodeName === "HTML" ? pt.ownerDocument.body : pt).removeChild(e.stateNode)
                                            } catch (n) {
                                                ot(e, l, n)
                                            } else try {
                                                pt.removeChild(e.stateNode)
                                            } catch (n) {
                                                ot(e, l, n)
                                            }
                                        break;
                                    case 18:
                                        pt !== null && (ll ? (t = pt, Sd(t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, e.stateNode), Na(t)) : Sd(pt, e.stateNode));
                                        break;
                                    case 4:
                                        a = pt, u = ll, pt = e.stateNode.containerInfo, ll = !0, Fl(t, l, e), pt = a, ll = u;
                                        break;
                                    case 0:
                                    case 11:
                                    case 14:
                                    case 15:
                                        ge(2, e, l), Ut || ge(4, e, l), Fl(t, l, e);
                                        break;
                                    case 1:
                                        Ut || (Nl(e, l), a = e.stateNode, typeof a.componentWillUnmount == "function" && xr(e, l, a)), Fl(t, l, e);
                                        break;
                                    case 21:
                                        Fl(t, l, e);
                                        break;
                                    case 22:
                                        Ut = (a = Ut) || e.memoizedState !== null, Fl(t, l, e), Ut = a;
                                        break;
                                    default:
                                        Fl(t, l, e)
                                }
                            }

                            function Dr(t, l) {
                                if (l.memoizedState === null && (t = l.alternate, t !== null && (t = t.memoizedState, t !== null))) {
                                    t = t.dehydrated;
                                    try {
                                        Na(t)
                                    } catch (e) {
                                        ot(l, l.return, e)
                                    }
                                }
                            }

                            function Or(t, l) {
                                if (l.memoizedState === null && (t = l.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null)))) try {
                                    Na(t)
                                } catch (e) {
                                    ot(l, l.return, e)
                                }
                            }

                            function dy(t) {
                                switch (t.tag) {
                                    case 31:
                                    case 13:
                                    case 19:
                                        var l = t.stateNode;
                                        return l === null && (l = t.stateNode = new Ar), l;
                                    case 22:
                                        return t = t.stateNode, l = t._retryCache, l === null && (l = t._retryCache = new Ar), l;
                                    default:
                                        throw Error(s(435, t.tag))
                                }
                            }

                            function _n(t, l) {
                                var e = dy(t);
                                l.forEach(function(a) {
                                    if (!e.has(a)) {
                                        e.add(a);
                                        var u = xy.bind(null, t, a);
                                        a.then(u, u)
                                    }
                                })
                            }

                            function el(t, l) {
                                var e = l.deletions;
                                if (e !== null)
                                    for (var a = 0; a < e.length; a++) {
                                        var u = e[a],
                                            n = t,
                                            i = l,
                                            c = i;
                                        t: for (; c !== null;) {
                                            switch (c.tag) {
                                                case 27:
                                                    if (Te(c.type)) {
                                                        pt = c.stateNode, ll = !1;
                                                        break t
                                                    }
                                                    break;
                                                case 5:
                                                    pt = c.stateNode, ll = !1;
                                                    break t;
                                                case 3:
                                                case 4:
                                                    pt = c.stateNode.containerInfo, ll = !0;
                                                    break t
                                            }
                                            c = c.return
                                        }
                                        if (pt === null) throw Error(s(160));
                                        _r(n, i, u), pt = null, ll = !1, n = u.alternate, n !== null && (n.return = null), u.return = null
                                    }
                                if (l.subtreeFlags & 13886)
                                    for (l = l.child; l !== null;) Ur(l, t), l = l.sibling
                            }
                            var jl = null;

                            function Ur(t, l) {
                                var e = t.alternate,
                                    a = t.flags;
                                switch (t.tag) {
                                    case 0:
                                    case 11:
                                    case 14:
                                    case 15:
                                        el(l, t), al(t), a & 4 && (ge(3, t, t.return), hu(3, t), ge(5, t, t.return));
                                        break;
                                    case 1:
                                        el(l, t), al(t), a & 512 && (Ut || e === null || Nl(e, e.return)), a & 64 && $l && (t = t.updateQueue, t !== null && (a = t.callbacks, a !== null && (e = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = e === null ? a : e.concat(a))));
                                        break;
                                    case 26:
                                        var u = jl;
                                        if (el(l, t), al(t), a & 512 && (Ut || e === null || Nl(e, e.return)), a & 4) {
                                            var n = e !== null ? e.memoizedState : null;
                                            if (a = t.memoizedState, e === null)
                                                if (a === null)
                                                    if (t.stateNode === null) {
                                                        t: {
                                                            a = t.type,
                                                                e = t.memoizedProps,
                                                                u = u.ownerDocument || u;l: switch (a) {
                                                                    case "title":
                                                                        n = u.getElementsByTagName("title")[0], (!n || n[La] || n[Yt] || n.namespaceURI === "http://www.w3.org/2000/svg" || n.hasAttribute("itemprop")) && (n = u.createElement(a), u.head.insertBefore(n, u.querySelector("head > title"))), Zt(n, a, e), n[Yt] = t, Bt(n), a = n;
                                                                        break t;
                                                                    case "link":
                                                                        var i = Ud("link", "href", u).get(a + (e.href || ""));
                                                                        if (i) {
                                                                            for (var c = 0; c < i.length; c++)
                                                                                if (n = i[c], n.getAttribute("href") === (e.href == null || e.href === "" ? null : e.href) && n.getAttribute("rel") === (e.rel == null ? null : e.rel) && n.getAttribute("title") === (e.title == null ? null : e.title) && n.getAttribute("crossorigin") === (e.crossOrigin == null ? null : e.crossOrigin)) {
                                                                                    i.splice(c, 1);
                                                                                    break l
                                                                                }
                                                                        }
                                                                        n = u.createElement(a), Zt(n, a, e), u.head.appendChild(n);
                                                                        break;
                                                                    case "meta":
                                                                        if (i = Ud("meta", "content", u).get(a + (e.content || ""))) {
                                                                            for (c = 0; c < i.length; c++)
                                                                                if (n = i[c], n.getAttribute("content") === (e.content == null ? null : "" + e.content) && n.getAttribute("name") === (e.name == null ? null : e.name) && n.getAttribute("property") === (e.property == null ? null : e.property) && n.getAttribute("http-equiv") === (e.httpEquiv == null ? null : e.httpEquiv) && n.getAttribute("charset") === (e.charSet == null ? null : e.charSet)) {
                                                                                    i.splice(c, 1);
                                                                                    break l
                                                                                }
                                                                        }
                                                                        n = u.createElement(a), Zt(n, a, e), u.head.appendChild(n);
                                                                        break;
                                                                    default:
                                                                        throw Error(s(468, a))
                                                                }
                                                            n[Yt] = t,
                                                                Bt(n),
                                                                a = n
                                                        }
                                                        t.stateNode = a
                                                    }
                                                    else jd(u, t.type, t.stateNode);
                                                else t.stateNode = Od(u, a, t.memoizedProps);
                                            else n !== a ? (n === null ? e.stateNode !== null && (e = e.stateNode, e.parentNode.removeChild(e)) : n.count--, a === null ? jd(u, t.type, t.stateNode) : Od(u, a, t.memoizedProps)) : a === null && t.stateNode !== null && Xc(t, t.memoizedProps, e.memoizedProps)
                                        }
                                        break;
                                    case 27:
                                        el(l, t), al(t), a & 512 && (Ut || e === null || Nl(e, e.return)), e !== null && a & 4 && Xc(t, t.memoizedProps, e.memoizedProps);
                                        break;
                                    case 5:
                                        if (el(l, t), al(t), a & 512 && (Ut || e === null || Nl(e, e.return)), t.flags & 32) {
                                            u = t.stateNode;
                                            try {
                                                na(u, "")
                                            } catch (B) {
                                                ot(t, t.return, B)
                                            }
                                        }
                                        a & 4 && t.stateNode != null && (u = t.memoizedProps, Xc(t, u, e !== null ? e.memoizedProps : u)), a & 1024 && (Lc = !0);
                                        break;
                                    case 6:
                                        if (el(l, t), al(t), a & 4) {
                                            if (t.stateNode === null) throw Error(s(162));
                                            a = t.memoizedProps, e = t.stateNode;
                                            try {
                                                e.nodeValue = a
                                            } catch (B) {
                                                ot(t, t.return, B)
                                            }
                                        }
                                        break;
                                    case 3:
                                        if (Vn = null, u = jl, jl = Zn(l.containerInfo), el(l, t), jl = u, al(t), a & 4 && e !== null && e.memoizedState.isDehydrated) try {
                                            Na(l.containerInfo)
                                        } catch (B) {
                                            ot(t, t.return, B)
                                        }
                                        Lc && (Lc = !1, jr(t));
                                        break;
                                    case 4:
                                        a = jl, jl = Zn(t.stateNode.containerInfo), el(l, t), al(t), jl = a;
                                        break;
                                    case 12:
                                        el(l, t), al(t);
                                        break;
                                    case 31:
                                        el(l, t), al(t), a & 4 && (a = t.updateQueue, a !== null && (t.updateQueue = null, _n(t, a)));
                                        break;
                                    case 13:
                                        el(l, t), al(t), t.child.flags & 8192 && t.memoizedState !== null != (e !== null && e.memoizedState !== null) && (On = cl()), a & 4 && (a = t.updateQueue, a !== null && (t.updateQueue = null, _n(t, a)));
                                        break;
                                    case 22:
                                        u = t.memoizedState !== null;
                                        var o = e !== null && e.memoizedState !== null,
                                            v = $l,
                                            z = Ut;
                                        if ($l = v || u, Ut = z || o, el(l, t), Ut = z, $l = v, al(t), a & 8192) t: for (l = t.stateNode, l._visibility = u ? l._visibility & -2 : l._visibility | 1, u && (e === null || o || $l || Ut || We(t)), e = null, l = t;;) {
                                            if (l.tag === 5 || l.tag === 26) {
                                                if (e === null) {
                                                    o = e = l;
                                                    try {
                                                        if (n = o.stateNode, u) i = n.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none";
                                                        else {
                                                            c = o.stateNode;
                                                            var H = o.memoizedProps.style,
                                                                g = H != null && H.hasOwnProperty("display") ? H.display : null;
                                                            c.style.display = g == null || typeof g == "boolean" ? "" : ("" + g).trim()
                                                        }
                                                    } catch (B) {
                                                        ot(o, o.return, B)
                                                    }
                                                }
                                            } else if (l.tag === 6) {
                                                if (e === null) {
                                                    o = l;
                                                    try {
                                                        o.stateNode.nodeValue = u ? "" : o.memoizedProps
                                                    } catch (B) {
                                                        ot(o, o.return, B)
                                                    }
                                                }
                                            } else if (l.tag === 18) {
                                                if (e === null) {
                                                    o = l;
                                                    try {
                                                        var x = o.stateNode;
                                                        u ? xd(x, !0) : xd(o.stateNode, !1)
                                                    } catch (B) {
                                                        ot(o, o.return, B)
                                                    }
                                                }
                                            } else if ((l.tag !== 22 && l.tag !== 23 || l.memoizedState === null || l === t) && l.child !== null) {
                                                l.child.return = l, l = l.child;
                                                continue
                                            }
                                            if (l === t) break t;
                                            for (; l.sibling === null;) {
                                                if (l.return === null || l.return === t) break t;
                                                e === l && (e = null), l = l.return
                                            }
                                            e === l && (e = null), l.sibling.return = l.return, l = l.sibling
                                        }
                                        a & 4 && (a = t.updateQueue, a !== null && (e = a.retryQueue, e !== null && (a.retryQueue = null, _n(t, e))));
                                        break;
                                    case 19:
                                        el(l, t), al(t), a & 4 && (a = t.updateQueue, a !== null && (t.updateQueue = null, _n(t, a)));
                                        break;
                                    case 30:
                                        break;
                                    case 21:
                                        break;
                                    default:
                                        el(l, t), al(t)
                                }
                            }

                            function al(t) {
                                var l = t.flags;
                                if (l & 2) {
                                    try {
                                        for (var e, a = t.return; a !== null;) {
                                            if (zr(a)) {
                                                e = a;
                                                break
                                            }
                                            a = a.return
                                        }
                                        if (e == null) throw Error(s(160));
                                        switch (e.tag) {
                                            case 27:
                                                var u = e.stateNode,
                                                    n = Qc(t);
                                                Mn(t, n, u);
                                                break;
                                            case 5:
                                                var i = e.stateNode;
                                                e.flags & 32 && (na(i, ""), e.flags &= -33);
                                                var c = Qc(t);
                                                Mn(t, c, i);
                                                break;
                                            case 3:
                                            case 4:
                                                var o = e.stateNode.containerInfo,
                                                    v = Qc(t);
                                                Zc(t, v, o);
                                                break;
                                            default:
                                                throw Error(s(161))
                                        }
                                    } catch (z) {
                                        ot(t, t.return, z)
                                    }
                                    t.flags &= -3
                                }
                                l & 4096 && (t.flags &= -4097)
                            }

                            function jr(t) {
                                if (t.subtreeFlags & 1024)
                                    for (t = t.child; t !== null;) {
                                        var l = t;
                                        jr(l), l.tag === 5 && l.flags & 1024 && l.stateNode.reset(), t = t.sibling
                                    }
                            }

                            function Pl(t, l) {
                                if (l.subtreeFlags & 8772)
                                    for (l = l.child; l !== null;) Hr(t, l.alternate, l), l = l.sibling
                            }

                            function We(t) {
                                for (t = t.child; t !== null;) {
                                    var l = t;
                                    switch (l.tag) {
                                        case 0:
                                        case 11:
                                        case 14:
                                        case 15:
                                            ge(4, l, l.return), We(l);
                                            break;
                                        case 1:
                                            Nl(l, l.return);
                                            var e = l.stateNode;
                                            typeof e.componentWillUnmount == "function" && xr(l, l.return, e), We(l);
                                            break;
                                        case 27:
                                            Au(l.stateNode);
                                        case 26:
                                        case 5:
                                            Nl(l, l.return), We(l);
                                            break;
                                        case 22:
                                            l.memoizedState === null && We(l);
                                            break;
                                        case 30:
                                            We(l);
                                            break;
                                        default:
                                            We(l)
                                    }
                                    t = t.sibling
                                }
                            }

                            function Il(t, l, e) {
                                for (e = e && (l.subtreeFlags & 8772) !== 0, l = l.child; l !== null;) {
                                    var a = l.alternate,
                                        u = t,
                                        n = l,
                                        i = n.flags;
                                    switch (n.tag) {
                                        case 0:
                                        case 11:
                                        case 15:
                                            Il(u, n, e), hu(4, n);
                                            break;
                                        case 1:
                                            if (Il(u, n, e), a = n, u = a.stateNode, typeof u.componentDidMount == "function") try {
                                                u.componentDidMount()
                                            } catch (v) {
                                                ot(a, a.return, v)
                                            }
                                            if (a = n, u = a.updateQueue, u !== null) {
                                                var c = a.stateNode;
                                                try {
                                                    var o = u.shared.hiddenCallbacks;
                                                    if (o !== null)
                                                        for (u.shared.hiddenCallbacks = null, u = 0; u < o.length; u++) os(o[u], c)
                                                } catch (v) {
                                                    ot(a, a.return, v)
                                                }
                                            }
                                            e && i & 64 && Sr(n), vu(n, n.return);
                                            break;
                                        case 27:
                                            Tr(n);
                                        case 26:
                                        case 5:
                                            Il(u, n, e), e && a === null && i & 4 && Er(n), vu(n, n.return);
                                            break;
                                        case 12:
                                            Il(u, n, e);
                                            break;
                                        case 31:
                                            Il(u, n, e), e && i & 4 && Dr(u, n);
                                            break;
                                        case 13:
                                            Il(u, n, e), e && i & 4 && Or(u, n);
                                            break;
                                        case 22:
                                            n.memoizedState === null && Il(u, n, e), vu(n, n.return);
                                            break;
                                        case 30:
                                            break;
                                        default:
                                            Il(u, n, e)
                                    }
                                    l = l.sibling
                                }
                            }

                            function Vc(t, l) {
                                var e = null;
                                t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), t = null, l.memoizedState !== null && l.memoizedState.cachePool !== null && (t = l.memoizedState.cachePool.pool), t !== e && (t != null && t.refCount++, e != null && eu(e))
                            }

                            function Kc(t, l) {
                                t = null, l.alternate !== null && (t = l.alternate.memoizedState.cache), l = l.memoizedState.cache, l !== t && (l.refCount++, t != null && eu(t))
                            }

                            function Cl(t, l, e, a) {
                                if (l.subtreeFlags & 10256)
                                    for (l = l.child; l !== null;) Cr(t, l, e, a), l = l.sibling
                            }

                            function Cr(t, l, e, a) {
                                var u = l.flags;
                                switch (l.tag) {
                                    case 0:
                                    case 11:
                                    case 15:
                                        Cl(t, l, e, a), u & 2048 && hu(9, l);
                                        break;
                                    case 1:
                                        Cl(t, l, e, a);
                                        break;
                                    case 3:
                                        Cl(t, l, e, a), u & 2048 && (t = null, l.alternate !== null && (t = l.alternate.memoizedState.cache), l = l.memoizedState.cache, l !== t && (l.refCount++, t != null && eu(t)));
                                        break;
                                    case 12:
                                        if (u & 2048) {
                                            Cl(t, l, e, a), t = l.stateNode;
                                            try {
                                                var n = l.memoizedProps,
                                                    i = n.id,
                                                    c = n.onPostCommit;
                                                typeof c == "function" && c(i, l.alternate === null ? "mount" : "update", t.passiveEffectDuration, -0)
                                            } catch (o) {
                                                ot(l, l.return, o)
                                            }
                                        } else Cl(t, l, e, a);
                                        break;
                                    case 31:
                                        Cl(t, l, e, a);
                                        break;
                                    case 13:
                                        Cl(t, l, e, a);
                                        break;
                                    case 23:
                                        break;
                                    case 22:
                                        n = l.stateNode, i = l.alternate, l.memoizedState !== null ? n._visibility & 2 ? Cl(t, l, e, a) : gu(t, l) : n._visibility & 2 ? Cl(t, l, e, a) : (n._visibility |= 2, Aa(t, l, e, a, (l.subtreeFlags & 10256) !== 0 || !1)), u & 2048 && Vc(i, l);
                                        break;
                                    case 24:
                                        Cl(t, l, e, a), u & 2048 && Kc(l.alternate, l);
                                        break;
                                    default:
                                        Cl(t, l, e, a)
                                }
                            }

                            function Aa(t, l, e, a, u) {
                                for (u = u && ((l.subtreeFlags & 10256) !== 0 || !1), l = l.child; l !== null;) {
                                    var n = t,
                                        i = l,
                                        c = e,
                                        o = a,
                                        v = i.flags;
                                    switch (i.tag) {
                                        case 0:
                                        case 11:
                                        case 15:
                                            Aa(n, i, c, o, u), hu(8, i);
                                            break;
                                        case 23:
                                            break;
                                        case 22:
                                            var z = i.stateNode;
                                            i.memoizedState !== null ? z._visibility & 2 ? Aa(n, i, c, o, u) : gu(n, i) : (z._visibility |= 2, Aa(n, i, c, o, u)), u && v & 2048 && Vc(i.alternate, i);
                                            break;
                                        case 24:
                                            Aa(n, i, c, o, u), u && v & 2048 && Kc(i.alternate, i);
                                            break;
                                        default:
                                            Aa(n, i, c, o, u)
                                    }
                                    l = l.sibling
                                }
                            }

                            function gu(t, l) {
                                if (l.subtreeFlags & 10256)
                                    for (l = l.child; l !== null;) {
                                        var e = t,
                                            a = l,
                                            u = a.flags;
                                        switch (a.tag) {
                                            case 22:
                                                gu(e, a), u & 2048 && Vc(a.alternate, a);
                                                break;
                                            case 24:
                                                gu(e, a), u & 2048 && Kc(a.alternate, a);
                                                break;
                                            default:
                                                gu(e, a)
                                        }
                                        l = l.sibling
                                    }
                            }
                            var pu = 8192;

                            function Ha(t, l, e) {
                                if (t.subtreeFlags & pu)
                                    for (t = t.child; t !== null;) Br(t, l, e), t = t.sibling
                            }

                            function Br(t, l, e) {
                                switch (t.tag) {
                                    case 26:
                                        Ha(t, l, e), t.flags & pu && t.memoizedState !== null && Py(e, jl, t.memoizedState, t.memoizedProps);
                                        break;
                                    case 5:
                                        Ha(t, l, e);
                                        break;
                                    case 3:
                                    case 4:
                                        var a = jl;
                                        jl = Zn(t.stateNode.containerInfo), Ha(t, l, e), jl = a;
                                        break;
                                    case 22:
                                        t.memoizedState === null && (a = t.alternate, a !== null && a.memoizedState !== null ? (a = pu, pu = 16777216, Ha(t, l, e), pu = a) : Ha(t, l, e));
                                        break;
                                    default:
                                        Ha(t, l, e)
                                }
                            }

                            function Rr(t) {
                                var l = t.alternate;
                                if (l !== null && (t = l.child, t !== null)) {
                                    l.child = null;
                                    do l = t.sibling, t.sibling = null, t = l; while (t !== null)
                                }
                                }

                                function bu(t) {
                                    var l = t.deletions;
                                    if ((t.flags & 16) !== 0) {
                                        if (l !== null)
                                            for (var e = 0; e < l.length; e++) {
                                                var a = l[e];
                                                Rt = a, qr(a, t)
                                            }
                                        Rr(t)
                                    }
                                    if (t.subtreeFlags & 10256)
                                        for (t = t.child; t !== null;) Nr(t), t = t.sibling
                                }

                                function Nr(t) {
                                    switch (t.tag) {
                                        case 0:
                                        case 11:
                                        case 15:
                                            bu(t), t.flags & 2048 && ge(9, t, t.return);
                                            break;
                                        case 3:
                                            bu(t);
                                            break;
                                        case 12:
                                            bu(t);
                                            break;
                                        case 22:
                                            var l = t.stateNode;
                                            t.memoizedState !== null && l._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (l._visibility &= -3, Dn(t)) : bu(t);
                                            break;
                                        default:
                                            bu(t)
                                    }
                                }

                                function Dn(t) {
                                    var l = t.deletions;
                                    if ((t.flags & 16) !== 0) {
                                        if (l !== null)
                                            for (var e = 0; e < l.length; e++) {
                                                var a = l[e];
                                                Rt = a, qr(a, t)
                                            }
                                        Rr(t)
                                    }
                                    for (t = t.child; t !== null;) {
                                        switch (l = t, l.tag) {
                                            case 0:
                                            case 11:
                                            case 15:
                                                ge(8, l, l.return), Dn(l);
                                                break;
                                            case 22:
                                                e = l.stateNode, e._visibility & 2 && (e._visibility &= -3, Dn(l));
                                                break;
                                            default:
                                                Dn(l)
                                        }
                                        t = t.sibling
                                    }
                                }

                                function qr(t, l) {
                                    for (; Rt !== null;) {
                                        var e = Rt;
                                        switch (e.tag) {
                                            case 0:
                                            case 11:
                                            case 15:
                                                ge(8, e, l);
                                                break;
                                            case 23:
                                            case 22:
                                                if (e.memoizedState !== null && e.memoizedState.cachePool !== null) {
                                                    var a = e.memoizedState.cachePool.pool;
                                                    a != null && a.refCount++
                                                }
                                                break;
                                            case 24:
                                                eu(e.memoizedState.cache)
                                        }
                                        if (a = e.child, a !== null) a.return = e, Rt = a;
                                        else t: for (e = t; Rt !== null;) {
                                            a = Rt;
                                            var u = a.sibling,
                                                n = a.return;
                                            if (Mr(a), a === e) {
                                                Rt = null;
                                                break t
                                            }
                                            if (u !== null) {
                                                u.return = n, Rt = u;
                                                break t
                                            }
                                            Rt = n
                                        }
                                    }
                                }
                                var my = {
                                    getCacheForType: function(t) {
                                        var l = Xt(_t),
                                            e = l.data.get(t);
                                        return e === void 0 && (e = t(), l.data.set(t, e)), e
                                    },
                                    cacheSignal: function() {
                                        return Xt(_t).controller.signal
                                    }
                                },
                                    yy = typeof WeakMap == "function" ? WeakMap : Map,
                                    it = 0,
                                    yt = null,
                                    $ = null,
                                    I = 0,
                                    ft = 0,
                                    yl = null,
                                    pe = !1,
                                    Ma = !1,
                                    Jc = !1,
                                    te = 0,
                                    zt = 0,
                                    be = 0,
                                    ke = 0,
                                    wc = 0,
                                    hl = 0,
                                    _a = 0,
                                    Su = null,
                                    ul = null,
                                    Wc = !1,
                                    On = 0,
                                    Yr = 0,
                                    Un = 1 / 0,
                                    jn = null,
                                    Se = null,
                                    jt = 0,
                                    xe = null,
                                    Da = null,
                                    le = 0,
                                    kc = 0,
                                    $c = null,
                                    Gr = null,
                                    xu = 0,
                                    Fc = null;

                                function vl() {
                                    return (it & 2) !== 0 && I !== 0 ? I & -I : M.T !== null ? af() : to()
                                }

                                function Xr() {
                                    if (hl === 0)
                                        if ((I & 536870912) === 0 || lt) {
                                            var t = Gu;
                                            Gu <<= 1, (Gu & 3932160) === 0 && (Gu = 262144), hl = t
                                        } else hl = 536870912;
                                    return t = dl.current, t !== null && (t.flags |= 32), hl
                                }

                                function nl(t, l, e) {
                                    (t === yt && (ft === 2 || ft === 9) || t.cancelPendingCommit !== null) && (Oa(t, 0), Ee(t, I, hl, !1)), Za(t, e), ((it & 2) === 0 || t !== yt) && (t === yt && ((it & 2) === 0 && (ke |= e), zt === 4 && Ee(t, I, hl, !1)), ql(t))
                                }

                                function Qr(t, l, e) {
                                    if ((it & 6) !== 0) throw Error(s(327));
                                    var a = !e && (l & 127) === 0 && (l & t.expiredLanes) === 0 || Qa(t, l),
                                        u = a ? gy(t, l) : Ic(t, l, !0),
                                        n = a;
                                    do {
                                        if (u === 0) {
                                            Ma && !a && Ee(t, l, 0, !1);
                                            break
                                        } else {
                                            if (e = t.current.alternate, n && !hy(e)) {
                                                u = Ic(t, l, !1), n = !1;
                                                continue
                                            }
                                            if (u === 2) {
                                                if (n = l, t.errorRecoveryDisabledLanes & n) var i = 0;
                                                else i = t.pendingLanes & -536870913, i = i !== 0 ? i : i & 536870912 ? 536870912 : 0;
                                                if (i !== 0) {
                                                    l = i;
                                                    t: {
                                                        var c = t;u = Su;
                                                        var o = c.current.memoizedState.isDehydrated;
                                                        if (o && (Oa(c, i).flags |= 256), i = Ic(c, i, !1), i !== 2) {
                                                            if (Jc && !o) {
                                                                c.errorRecoveryDisabledLanes |= n, ke |= n, u = 4;
                                                                break t
                                                            }
                                                            n = ul, ul = u, n !== null && (ul === null ? ul = n : ul.push.apply(ul, n))
                                                        }
                                                        u = i
                                                    }
                                                    if (n = !1, u !== 2) continue
                                                }
                                            }
                                            if (u === 1) {
                                                Oa(t, 0), Ee(t, l, 0, !0);
                                                break
                                            }
                                            t: {
                                                switch (a = t, n = u, n) {
                                                    case 0:
                                                    case 1:
                                                        throw Error(s(345));
                                                    case 4:
                                                        if ((l & 4194048) !== l) break;
                                                    case 6:
                                                        Ee(a, l, hl, !pe);
                                                        break t;
                                                    case 2:
                                                        ul = null;
                                                        break;
                                                    case 3:
                                                    case 5:
                                                        break;
                                                    default:
                                                        throw Error(s(329))
                                                }
                                                if ((l & 62914560) === l && (u = On + 300 - cl(), 10 < u)) {
                                                    if (Ee(a, l, hl, !pe), Qu(a, 0, !0) !== 0) break t;
                                                    le = l, a.timeoutHandle = pd(Zr.bind(null, a, e, ul, jn, Wc, l, hl, ke, _a, pe, n, "Throttled", -0, 0), u);
                                                    break t
                                                }
                                                Zr(a, e, ul, jn, Wc, l, hl, ke, _a, pe, n, null, -0, 0)
                                            }
                                        }
                                        break
                                    } while (!0);
                                    ql(t)
                                }

                                function Zr(t, l, e, a, u, n, i, c, o, v, z, H, g, x) {
                                    if (t.timeoutHandle = -1, H = l.subtreeFlags, H & 8192 || (H & 16785408) === 16785408) {
                                        H = {
                                            stylesheets: null,
                                            count: 0,
                                            imgCount: 0,
                                            imgBytes: 0,
                                            suspenseyImages: [],
                                            waitingForImages: !0,
                                            waitingForViewTransition: !1,
                                            unsuspend: Xl
                                        }, Br(l, n, H);
                                        var B = (n & 62914560) === n ? On - cl() : (n & 4194048) === n ? Yr - cl() : 0;
                                        if (B = Iy(H, B), B !== null) {
                                            le = n, t.cancelPendingCommit = B($r.bind(null, t, l, n, e, a, u, i, c, o, z, H, null, g, x)), Ee(t, n, i, !v);
                                            return
                                        }
                                    }
                                    $r(t, l, n, e, a, u, i, c, o)
                                }

                                function hy(t) {
                                    for (var l = t;;) {
                                        var e = l.tag;
                                        if ((e === 0 || e === 11 || e === 15) && l.flags & 16384 && (e = l.updateQueue, e !== null && (e = e.stores, e !== null)))
                                            for (var a = 0; a < e.length; a++) {
                                                var u = e[a],
                                                    n = u.getSnapshot;
                                                u = u.value;
                                                try {
                                                    if (!sl(n(), u)) return !1
                                                } catch {
                                                    return !1
                                                }
                                            }
                                        if (e = l.child, l.subtreeFlags & 16384 && e !== null) e.return = l, l = e;
                                        else {
                                            if (l === t) break;
                                            for (; l.sibling === null;) {
                                                if (l.return === null || l.return === t) return !0;
                                                l = l.return
                                            }
                                            l.sibling.return = l.return, l = l.sibling
                                        }
                                    }
                                    return !0
                                }

                                function Ee(t, l, e, a) {
                                    l &= ~wc, l &= ~ke, t.suspendedLanes |= l, t.pingedLanes &= ~l, a && (t.warmLanes |= l), a = t.expirationTimes;
                                    for (var u = l; 0 < u;) {
                                        var n = 31 - ol(u),
                                            i = 1 << n;
                                        a[n] = -1, u &= ~i
                                    }
                                    e !== 0 && Ff(t, e, l)
                                }

                                function Cn() {
                                    return (it & 6) === 0 ? (Eu(0), !1) : !0
                                }

                                function Pc() {
                                    if ($ !== null) {
                                        if (ft === 0) var t = $.return;
                                        else t = $, Vl = Xe = null, yc(t), Sa = null, uu = 0, t = $;
                                        for (; t !== null;) br(t.alternate, t), t = t.return;
                                        $ = null
                                    }
                                }

                                function Oa(t, l) {
                                    var e = t.timeoutHandle;
                                    e !== -1 && (t.timeoutHandle = -1, Ry(e)), e = t.cancelPendingCommit, e !== null && (t.cancelPendingCommit = null, e()), le = 0, Pc(), yt = t, $ = e = Zl(t.current, null), I = l, ft = 0, yl = null, pe = !1, Ma = Qa(t, l), Jc = !1, _a = hl = wc = ke = be = zt = 0, ul = Su = null, Wc = !1, (l & 8) !== 0 && (l |= l & 32);
                                    var a = t.entangledLanes;
                                    if (a !== 0)
                                        for (t = t.entanglements, a &= l; 0 < a;) {
                                            var u = 31 - ol(a),
                                                n = 1 << u;
                                            l |= t[u], a &= ~n
                                        }
                                    return te = l, Iu(), e
                                }

                                function Lr(t, l) {
                                    J = null, M.H = du, l === ba || l === fn ? (l = ns(), ft = 3) : l === ec ? (l = ns(), ft = 4) : ft = l === Oc ? 8 : l !== null && typeof l == "object" && typeof l.then == "function" ? 6 : 1, yl = l, $ === null && (zt = 1, En(t, zl(l, t.current)))
                                }

                                function Vr() {
                                    var t = dl.current;
                                    return t === null ? !0 : (I & 4194048) === I ? Ml === null : (I & 62914560) === I || (I & 536870912) !== 0 ? t === Ml : !1
                                }

                                function Kr() {
                                    var t = M.H;
                                    return M.H = du, t === null ? du : t
                                }

                                function Jr() {
                                    var t = M.A;
                                    return M.A = my, t
                                }

                                function Bn() {
                                    zt = 4, pe || (I & 4194048) !== I && dl.current !== null || (Ma = !0), (be & 134217727) === 0 && (ke & 134217727) === 0 || yt === null || Ee(yt, I, hl, !1)
                                }

                                function Ic(t, l, e) {
                                    var a = it;
                                    it |= 2;
                                    var u = Kr(),
                                        n = Jr();
                                    (yt !== t || I !== l) && (jn = null, Oa(t, l)), l = !1;
                                    var i = zt;
                                    t: do try {
                                        if (ft !== 0 && $ !== null) {
                                            var c = $,
                                                o = yl;
                                            switch (ft) {
                                                case 8:
                                                    Pc(), i = 6;
                                                    break t;
                                                case 3:
                                                case 2:
                                                case 9:
                                                case 6:
                                                    dl.current === null && (l = !0);
                                                    var v = ft;
                                                    if (ft = 0, yl = null, Ua(t, c, o, v), e && Ma) {
                                                        i = 0;
                                                        break t
                                                    }
                                                    break;
                                                default:
                                                    v = ft, ft = 0, yl = null, Ua(t, c, o, v)
                                            }
                                        }
                                        vy(), i = zt;
                                        break
                                    } catch (z) {
                                        Lr(t, z)
                                    }
                                    while (!0);
                                    return l && t.shellSuspendCounter++, Vl = Xe = null, it = a, M.H = u, M.A = n, $ === null && (yt = null, I = 0, Iu()), i
                                }

                                function vy() {
                                    for (; $ !== null;) wr($)
                                }

                                function gy(t, l) {
                                    var e = it;
                                    it |= 2;
                                    var a = Kr(),
                                        u = Jr();
                                    yt !== t || I !== l ? (jn = null, Un = cl() + 500, Oa(t, l)) : Ma = Qa(t, l);
                                    t: do try {
                                        if (ft !== 0 && $ !== null) {
                                            l = $;
                                            var n = yl;
                                            l: switch (ft) {
                                                case 1:
                                                    ft = 0, yl = null, Ua(t, l, n, 1);
                                                    break;
                                                case 2:
                                                case 9:
                                                    if (as(n)) {
                                                        ft = 0, yl = null, Wr(l);
                                                        break
                                                    }
                                                    l = function() {
                                                        ft !== 2 && ft !== 9 || yt !== t || (ft = 7), ql(t)
                                                    }, n.then(l, l);
                                                    break t;
                                                case 3:
                                                    ft = 7;
                                                    break t;
                                                case 4:
                                                    ft = 5;
                                                    break t;
                                                case 7:
                                                    as(n) ? (ft = 0, yl = null, Wr(l)) : (ft = 0, yl = null, Ua(t, l, n, 7));
                                                    break;
                                                case 5:
                                                    var i = null;
                                                    switch ($.tag) {
                                                        case 26:
                                                            i = $.memoizedState;
                                                        case 5:
                                                        case 27:
                                                            var c = $;
                                                            if (i ? Cd(i) : c.stateNode.complete) {
                                                                ft = 0, yl = null;
                                                                var o = c.sibling;
                                                                if (o !== null) $ = o;
                                                                else {
                                                                    var v = c.return;
                                                                    v !== null ? ($ = v, Rn(v)) : $ = null
                                                                }
                                                                break l
                                                            }
                                                    }
                                                    ft = 0, yl = null, Ua(t, l, n, 5);
                                                    break;
                                                case 6:
                                                    ft = 0, yl = null, Ua(t, l, n, 6);
                                                    break;
                                                case 8:
                                                    Pc(), zt = 6;
                                                    break t;
                                                default:
                                                    throw Error(s(462))
                                            }
                                        }
                                        py();
                                        break
                                    } catch (z) {
                                        Lr(t, z)
                                    }
                                    while (!0);
                                    return Vl = Xe = null, M.H = a, M.A = u, it = e, $ !== null ? 0 : (yt = null, I = 0, Iu(), zt)
                                }

                                function py() {
                                    for (; $ !== null && !Q0();) wr($)
                                }

                                function wr(t) {
                                    var l = gr(t.alternate, t, te);
                                    t.memoizedProps = t.pendingProps, l === null ? Rn(t) : $ = l
                                }

                                function Wr(t) {
                                    var l = t,
                                        e = l.alternate;
                                    switch (l.tag) {
                                        case 15:
                                        case 0:
                                            l = rr(e, l, l.pendingProps, l.type, void 0, I);
                                            break;
                                        case 11:
                                            l = rr(e, l, l.pendingProps, l.type.render, l.ref, I);
                                            break;
                                        case 5:
                                            yc(l);
                                        default:
                                            br(e, l), l = $ = Jo(l, te), l = gr(e, l, te)
                                    }
                                    t.memoizedProps = t.pendingProps, l === null ? Rn(t) : $ = l
                                }

                                function Ua(t, l, e, a) {
                                    Vl = Xe = null, yc(l), Sa = null, uu = 0;
                                    var u = l.return;
                                    try {
                                        if (iy(t, u, l, e, I)) {
                                            zt = 1, En(t, zl(e, t.current)), $ = null;
                                            return
                                        }
                                    } catch (n) {
                                        if (u !== null) throw $ = u, n;
                                        zt = 1, En(t, zl(e, t.current)), $ = null;
                                        return
                                    }
                                    l.flags & 32768 ? (lt || a === 1 ? t = !0 : Ma || (I & 536870912) !== 0 ? t = !1 : (pe = t = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = dl.current, a !== null && a.tag === 13 && (a.flags |= 16384))), kr(l, t)) : Rn(l)
                                }

                                function Rn(t) {
                                    var l = t;
                                    do {
                                        if ((l.flags & 32768) !== 0) {
                                            kr(l, pe);
                                            return
                                        }
                                        t = l.return;
                                        var e = oy(l.alternate, l, te);
                                        if (e !== null) {
                                            $ = e;
                                            return
                                        }
                                        if (l = l.sibling, l !== null) {
                                            $ = l;
                                            return
                                        }
                                        $ = l = t
                                    } while (l !== null);
                                    zt === 0 && (zt = 5)
                                }

                                function kr(t, l) {
                                    do {
                                        var e = sy(t.alternate, t);
                                        if (e !== null) {
                                            e.flags &= 32767, $ = e;
                                            return
                                        }
                                        if (e = t.return, e !== null && (e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null), !l && (t = t.sibling, t !== null)) {
                                            $ = t;
                                            return
                                        }
                                        $ = t = e
                                    } while (t !== null);
                                    zt = 6, $ = null
                                }

                                function $r(t, l, e, a, u, n, i, c, o) {
                                    t.cancelPendingCommit = null;
                                    do Nn(); while (jt !== 0);
                                    if ((it & 6) !== 0) throw Error(s(327));
                                    if (l !== null) {
                                        if (l === t.current) throw Error(s(177));
                                        if (n = l.lanes | l.childLanes, n |= Qi, F0(t, e, n, i, c, o), t === yt && ($ = yt = null, I = 0), Da = l, xe = t, le = e, kc = n, $c = u, Gr = a, (l.subtreeFlags & 10256) !== 0 || (l.flags & 10256) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, Ey(qu, function() {
                                            return ld(), null
                                        })) : (t.callbackNode = null, t.callbackPriority = 0), a = (l.flags & 13878) !== 0, (l.subtreeFlags & 13878) !== 0 || a) {
                                            a = M.T, M.T = null, u = U.p, U.p = 2, i = it, it |= 4;
                                            try {
                                                ry(t, l, e)
                                            } finally {
                                                it = i, U.p = u, M.T = a
                                            }
                                        }
                                        jt = 1, Fr(), Pr(), Ir()
                                    }
                                }

                                function Fr() {
                                    if (jt === 1) {
                                        jt = 0;
                                        var t = xe,
                                            l = Da,
                                            e = (l.flags & 13878) !== 0;
                                        if ((l.subtreeFlags & 13878) !== 0 || e) {
                                            e = M.T, M.T = null;
                                            var a = U.p;
                                            U.p = 2;
                                            var u = it;
                                            it |= 4;
                                            try {
                                                Ur(l, t);
                                                var n = df,
                                                    i = qo(t.containerInfo),
                                                    c = n.focusedElem,
                                                    o = n.selectionRange;
                                                if (i !== c && c && c.ownerDocument && No(c.ownerDocument.documentElement, c)) {
                                                    if (o !== null && Ni(c)) {
                                                        var v = o.start,
                                                            z = o.end;
                                                        if (z === void 0 && (z = v), "selectionStart" in c) c.selectionStart = v, c.selectionEnd = Math.min(z, c.value.length);
                                                        else {
                                                            var H = c.ownerDocument || document,
                                                                g = H && H.defaultView || window;
                                                            if (g.getSelection) {
                                                                var x = g.getSelection(),
                                                                    B = c.textContent.length,
                                                                    Q = Math.min(o.start, B),
                                                                    dt = o.end === void 0 ? Q : Math.min(o.end, B);
                                                                !x.extend && Q > dt && (i = dt, dt = Q, Q = i);
                                                                var y = Ro(c, Q),
                                                                    m = Ro(c, dt);
                                                                if (y && m && (x.rangeCount !== 1 || x.anchorNode !== y.node || x.anchorOffset !== y.offset || x.focusNode !== m.node || x.focusOffset !== m.offset)) {
                                                                    var h = H.createRange();
                                                                    h.setStart(y.node, y.offset), x.removeAllRanges(), Q > dt ? (x.addRange(h), x.extend(m.node, m.offset)) : (h.setEnd(m.node, m.offset), x.addRange(h))
                                                                }
                                                            }
                                                        }
                                                    }
                                                    for (H = [], x = c; x = x.parentNode;) x.nodeType === 1 && H.push({
                                                        element: x,
                                                        left: x.scrollLeft,
                                                        top: x.scrollTop
                                                    });
                                                    for (typeof c.focus == "function" && c.focus(), c = 0; c < H.length; c++) {
                                                        var A = H[c];
                                                        A.element.scrollLeft = A.left, A.element.scrollTop = A.top
                                                    }
                                                }
                                                Wn = !!rf, df = rf = null
                                            } finally {
                                                it = u, U.p = a, M.T = e
                                            }
                                        }
                                        t.current = l, jt = 2
                                    }
                                }

                                function Pr() {
                                    if (jt === 2) {
                                        jt = 0;
                                        var t = xe,
                                            l = Da,
                                            e = (l.flags & 8772) !== 0;
                                        if ((l.subtreeFlags & 8772) !== 0 || e) {
                                            e = M.T, M.T = null;
                                            var a = U.p;
                                            U.p = 2;
                                            var u = it;
                                            it |= 4;
                                            try {
                                                Hr(t, l.alternate, l)
                                            } finally {
                                                it = u, U.p = a, M.T = e
                                            }
                                        }
                                        jt = 3
                                    }
                                }

                                function Ir() {
                                    if (jt === 4 || jt === 3) {
                                        jt = 0, Z0();
                                        var t = xe,
                                            l = Da,
                                            e = le,
                                            a = Gr;
                                        (l.subtreeFlags & 10256) !== 0 || (l.flags & 10256) !== 0 ? jt = 5 : (jt = 0, Da = xe = null, td(t, t.pendingLanes));
                                        var u = t.pendingLanes;
                                        if (u === 0 && (Se = null), gi(e), l = l.stateNode, fl && typeof fl.onCommitFiberRoot == "function") try {
                                            fl.onCommitFiberRoot(Xa, l, void 0, (l.current.flags & 128) === 128)
                                        } catch {}
                                        if (a !== null) {
                                            l = M.T, u = U.p, U.p = 2, M.T = null;
                                            try {
                                                for (var n = t.onRecoverableError, i = 0; i < a.length; i++) {
                                                    var c = a[i];
                                                    n(c.value, {
                                                        componentStack: c.stack
                                                    })
                                                }
                                            } finally {
                                                M.T = l, U.p = u
                                            }
                                        }(le & 3) !== 0 && Nn(), ql(t), u = t.pendingLanes, (e & 261930) !== 0 && (u & 42) !== 0 ? t === Fc ? xu++ : (xu = 0, Fc = t) : xu = 0, Eu(0)
                                    }
                                }

                                function td(t, l) {
                                    (t.pooledCacheLanes &= l) === 0 && (l = t.pooledCache, l != null && (t.pooledCache = null, eu(l)))
                                }

                                function Nn() {
                                    return Fr(), Pr(), Ir(), ld()
                                }

                                function ld() {
                                    if (jt !== 5) return !1;
                                    var t = xe,
                                        l = kc;
                                    kc = 0;
                                    var e = gi(le),
                                        a = M.T,
                                        u = U.p;
                                    try {
                                        U.p = 32 > e ? 32 : e, M.T = null, e = $c, $c = null;
                                        var n = xe,
                                            i = le;
                                        if (jt = 0, Da = xe = null, le = 0, (it & 6) !== 0) throw Error(s(331));
                                        var c = it;
                                        if (it |= 4, Nr(n.current), Cr(n, n.current, i, e), it = c, Eu(0, !1), fl && typeof fl.onPostCommitFiberRoot == "function") try {
                                            fl.onPostCommitFiberRoot(Xa, n)
                                        } catch {}
                                        return !0
                                    } finally {
                                        U.p = u, M.T = a, td(t, l)
                                    }
                                }

                                function ed(t, l, e) {
                                    l = zl(e, l), l = Dc(t.stateNode, l, 2), t = ye(t, l, 2), t !== null && (Za(t, 2), ql(t))
                                }

                                function ot(t, l, e) {
                                    if (t.tag === 3) ed(t, t, e);
                                    else
                                        for (; l !== null;) {
                                            if (l.tag === 3) {
                                                ed(l, t, e);
                                                break
                                            } else if (l.tag === 1) {
                                                var a = l.stateNode;
                                                if (typeof l.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Se === null || !Se.has(a))) {
                                                    t = zl(e, t), e = ar(2), a = ye(l, e, 2), a !== null && (ur(e, a, l, t), Za(a, 2), ql(a));
                                                    break
                                                }
                                            }
                                            l = l.return
                                        }
                                }

                                function tf(t, l, e) {
                                    var a = t.pingCache;
                                    if (a === null) {
                                        a = t.pingCache = new yy;
                                        var u = new Set;
                                        a.set(l, u)
                                    } else u = a.get(l), u === void 0 && (u = new Set, a.set(l, u));
                                    u.has(e) || (Jc = !0, u.add(e), t = by.bind(null, t, l, e), l.then(t, t))
                                }

                                function by(t, l, e) {
                                    var a = t.pingCache;
                                    a !== null && a.delete(l), t.pingedLanes |= t.suspendedLanes & e, t.warmLanes &= ~e, yt === t && (I & e) === e && (zt === 4 || zt === 3 && (I & 62914560) === I && 300 > cl() - On ? (it & 2) === 0 && Oa(t, 0) : wc |= e, _a === I && (_a = 0)), ql(t)
                                }

                                function ad(t, l) {
                                    l === 0 && (l = $f()), t = qe(t, l), t !== null && (Za(t, l), ql(t))
                                }

                                function Sy(t) {
                                    var l = t.memoizedState,
                                        e = 0;
                                    l !== null && (e = l.retryLane), ad(t, e)
                                }

                                function xy(t, l) {
                                    var e = 0;
                                    switch (t.tag) {
                                        case 31:
                                        case 13:
                                            var a = t.stateNode,
                                                u = t.memoizedState;
                                            u !== null && (e = u.retryLane);
                                            break;
                                        case 19:
                                            a = t.stateNode;
                                            break;
                                        case 22:
                                            a = t.stateNode._retryCache;
                                            break;
                                        default:
                                            throw Error(s(314))
                                    }
                                    a !== null && a.delete(l), ad(t, e)
                                }

                                function Ey(t, l) {
                                    return mi(t, l)
                                }
                                var qn = null,
                                    ja = null,
                                    lf = !1,
                                    Yn = !1,
                                    ef = !1,
                                    ze = 0;

                                function ql(t) {
                                    t !== ja && t.next === null && (ja === null ? qn = ja = t : ja = ja.next = t), Yn = !0, lf || (lf = !0, Ty())
                                }

                                function Eu(t, l) {
                                    if (!ef && Yn) {
                                        ef = !0;
                                        do
                                            for (var e = !1, a = qn; a !== null;) {
                                                if (t !== 0) {
                                                    var u = a.pendingLanes;
                                                    if (u === 0) var n = 0;
                                                    else {
                                                        var i = a.suspendedLanes,
                                                            c = a.pingedLanes;
                                                        n = (1 << 31 - ol(42 | t) + 1) - 1, n &= u & ~(i & ~c), n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0
                                                    }
                                                    n !== 0 && (e = !0, cd(a, n))
                                                } else n = I, n = Qu(a, a === yt ? n : 0, a.cancelPendingCommit !== null || a.timeoutHandle !== -1), (n & 3) === 0 || Qa(a, n) || (e = !0, cd(a, n));
                                                a = a.next
                                            }
                                        while (e);
                                        ef = !1
                                    }
                                }

                                function zy() {
                                    ud()
                                }

                                function ud() {
                                    Yn = lf = !1;
                                    var t = 0;
                                    ze !== 0 && By() && (t = ze);
                                    for (var l = cl(), e = null, a = qn; a !== null;) {
                                        var u = a.next,
                                            n = nd(a, l);
                                        n === 0 ? (a.next = null, e === null ? qn = u : e.next = u, u === null && (ja = e)) : (e = a, (t !== 0 || (n & 3) !== 0) && (Yn = !0)), a = u
                                    }
                                    jt !== 0 && jt !== 5 || Eu(t), ze !== 0 && (ze = 0)
                                }

                                function nd(t, l) {
                                    for (var e = t.suspendedLanes, a = t.pingedLanes, u = t.expirationTimes, n = t.pendingLanes & -62914561; 0 < n;) {
                                        var i = 31 - ol(n),
                                            c = 1 << i,
                                            o = u[i];
                                        o === -1 ? ((c & e) === 0 || (c & a) !== 0) && (u[i] = $0(c, l)) : o <= l && (t.expiredLanes |= c), n &= ~c
                                    }
                                    if (l = yt, e = I, e = Qu(t, t === l ? e : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1), a = t.callbackNode, e === 0 || t === l && (ft === 2 || ft === 9) || t.cancelPendingCommit !== null) return a !== null && a !== null && yi(a), t.callbackNode = null, t.callbackPriority = 0;
                                    if ((e & 3) === 0 || Qa(t, e)) {
                                        if (l = e & -e, l === t.callbackPriority) return l;
                                        switch (a !== null && yi(a), gi(e)) {
                                            case 2:
                                            case 8:
                                                e = Wf;
                                                break;
                                            case 32:
                                                e = qu;
                                                break;
                                            case 268435456:
                                                e = kf;
                                                break;
                                            default:
                                                e = qu
                                        }
                                        return a = id.bind(null, t), e = mi(e, a), t.callbackPriority = l, t.callbackNode = e, l
                                    }
                                    return a !== null && a !== null && yi(a), t.callbackPriority = 2, t.callbackNode = null, 2
                                }

                                function id(t, l) {
                                    if (jt !== 0 && jt !== 5) return t.callbackNode = null, t.callbackPriority = 0, null;
                                    var e = t.callbackNode;
                                    if (Nn() && t.callbackNode !== e) return null;
                                    var a = I;
                                    return a = Qu(t, t === yt ? a : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1), a === 0 ? null : (Qr(t, a, l), nd(t, cl()), t.callbackNode != null && t.callbackNode === e ? id.bind(null, t) : null)
                                }

                                function cd(t, l) {
                                    if (Nn()) return null;
                                    Qr(t, l, !0)
                                }

                                function Ty() {
                                    Ny(function() {
                                        (it & 6) !== 0 ? mi(wf, zy) : ud()
                                    })
                                }

                                function af() {
                                    if (ze === 0) {
                                        var t = ga;
                                        t === 0 && (t = Yu, Yu <<= 1, (Yu & 261888) === 0 && (Yu = 256)), ze = t
                                    }
                                    return ze
                                }

                                function fd(t) {
                                    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : Ku("" + t)
                                }

                                function od(t, l) {
                                    var e = l.ownerDocument.createElement("input");
                                    return e.name = l.name, e.value = l.value, t.id && e.setAttribute("form", t.id), l.parentNode.insertBefore(e, l), t = new FormData(t), e.parentNode.removeChild(e), t
                                }

                                function Ay(t, l, e, a, u) {
                                    if (l === "submit" && e && e.stateNode === u) {
                                        var n = fd((u[It] || null).action),
                                            i = a.submitter;
                                        i && (l = (l = i[It] || null) ? fd(l.formAction) : i.getAttribute("formAction"), l !== null && (n = l, i = null));
                                        var c = new ku("action", "action", null, a, u);
                                        t.push({
                                            event: c,
                                            listeners: [{
                                                instance: null,
                                                listener: function() {
                                                    if (a.defaultPrevented) {
                                                        if (ze !== 0) {
                                                            var o = i ? od(u, i) : new FormData(u);
                                                            zc(e, {
                                                                pending: !0,
                                                                data: o,
                                                                method: u.method,
                                                                action: n
                                                            }, null, o)
                                                        }
                                                    } else typeof n == "function" && (c.preventDefault(), o = i ? od(u, i) : new FormData(u), zc(e, {
                                                        pending: !0,
                                                        data: o,
                                                        method: u.method,
                                                        action: n
                                                    }, n, o))
                                                },
                                                currentTarget: u
                                            }]
                                        })
                                    }
                                }
                                for (var uf = 0; uf < Xi.length; uf++) {
                                    var nf = Xi[uf],
                                        Hy = nf.toLowerCase(),
                                        My = nf[0].toUpperCase() + nf.slice(1);
                                    Ul(Hy, "on" + My)
                                }
                                Ul(Xo, "onAnimationEnd"), Ul(Qo, "onAnimationIteration"), Ul(Zo, "onAnimationStart"), Ul("dblclick", "onDoubleClick"), Ul("focusin", "onFocus"), Ul("focusout", "onBlur"), Ul(Lm, "onTransitionRun"), Ul(Vm, "onTransitionStart"), Ul(Km, "onTransitionCancel"), Ul(Lo, "onTransitionEnd"), aa("onMouseEnter", ["mouseout", "mouseover"]), aa("onMouseLeave", ["mouseout", "mouseover"]), aa("onPointerEnter", ["pointerout", "pointerover"]), aa("onPointerLeave", ["pointerout", "pointerover"]), Ce("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Ce("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Ce("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), Ce("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Ce("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Ce("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
                                var zu = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),
                                    _y = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(zu));

                                function sd(t, l) {
                                    l = (l & 4) !== 0;
                                    for (var e = 0; e < t.length; e++) {
                                        var a = t[e],
                                            u = a.event;
                                        a = a.listeners;
                                        t: {
                                            var n = void 0;
                                            if (l)
                                                for (var i = a.length - 1; 0 <= i; i--) {
                                                    var c = a[i],
                                                        o = c.instance,
                                                        v = c.currentTarget;
                                                    if (c = c.listener, o !== n && u.isPropagationStopped()) break t;
                                                    n = c, u.currentTarget = v;
                                                    try {
                                                        n(u)
                                                    } catch (z) {
                                                        Pu(z)
                                                    }
                                                    u.currentTarget = null, n = o
                                                } else
                                                    for (i = 0; i < a.length; i++) {
                                                        if (c = a[i], o = c.instance, v = c.currentTarget, c = c.listener, o !== n && u.isPropagationStopped()) break t;
                                                        n = c, u.currentTarget = v;
                                                        try {
                                                            n(u)
                                                        } catch (z) {
                                                            Pu(z)
                                                        }
                                                        u.currentTarget = null, n = o
                                                    }
                                        }
                                    }
                                }

                                function F(t, l) {
                                    var e = l[pi];
                                    e === void 0 && (e = l[pi] = new Set);
                                    var a = t + "__bubble";
                                    e.has(a) || (rd(l, t, 2, !1), e.add(a))
                                }

                                function cf(t, l, e) {
                                    var a = 0;
                                    l && (a |= 4), rd(e, t, a, l)
                                }
                                var Gn = "_reactListening" + Math.random().toString(36).slice(2);

                                function ff(t) {
                                    if (!t[Gn]) {
                                        t[Gn] = !0, ao.forEach(function(e) {
                                            e !== "selectionchange" && (_y.has(e) || cf(e, !1, t), cf(e, !0, t))
                                        });
                                        var l = t.nodeType === 9 ? t : t.ownerDocument;
                                        l === null || l[Gn] || (l[Gn] = !0, cf("selectionchange", !1, l))
                                    }
                                }

                                function rd(t, l, e, a) {
                                    switch (Xd(l)) {
                                        case 2:
                                            var u = eh;
                                            break;
                                        case 8:
                                            u = ah;
                                            break;
                                        default:
                                            u = zf
                                    }
                                    e = u.bind(null, l, e, t), u = void 0, !Mi || l !== "touchstart" && l !== "touchmove" && l !== "wheel" || (u = !0), a ? u !== void 0 ? t.addEventListener(l, e, {
                                        capture: !0,
                                        passive: u
                                    }) : t.addEventListener(l, e, !0) : u !== void 0 ? t.addEventListener(l, e, {
                                        passive: u
                                    }) : t.addEventListener(l, e, !1)
                                }

                                function of(t, l, e, a, u) {
                                    var n = a;
                                    if ((l & 1) === 0 && (l & 2) === 0 && a !== null) t: for (;;) {
                                        if (a === null) return;
                                        var i = a.tag;
                                        if (i === 3 || i === 4) {
                                            var c = a.stateNode.containerInfo;
                                            if (c === u) break;
                                            if (i === 4)
                                                for (i = a.return; i !== null;) {
                                                    var o = i.tag;
                                                    if ((o === 3 || o === 4) && i.stateNode.containerInfo === u) return;
                                                    i = i.return
                                                }
                                            for (; c !== null;) {
                                                if (i = ta(c), i === null) return;
                                                if (o = i.tag, o === 5 || o === 6 || o === 26 || o === 27) {
                                                    a = n = i;
                                                    continue t
                                                }
                                                c = c.parentNode
                                            }
                                        }
                                        a = a.return
                                    }
                                    vo(function() {
                                        var v = n,
                                            z = Ai(e),
                                            H = [];
                                        t: {
                                            var g = Vo.get(t);
                                            if (g !== void 0) {
                                                var x = ku,
                                                    B = t;
                                                switch (t) {
                                                    case "keypress":
                                                        if (wu(e) === 0) break t;
                                                    case "keydown":
                                                    case "keyup":
                                                        x = xm;
                                                        break;
                                                    case "focusin":
                                                        B = "focus", x = Ui;
                                                        break;
                                                    case "focusout":
                                                        B = "blur", x = Ui;
                                                        break;
                                                    case "beforeblur":
                                                    case "afterblur":
                                                        x = Ui;
                                                        break;
                                                    case "click":
                                                        if (e.button === 2) break t;
                                                    case "auxclick":
                                                    case "dblclick":
                                                    case "mousedown":
                                                    case "mousemove":
                                                    case "mouseup":
                                                    case "mouseout":
                                                    case "mouseover":
                                                    case "contextmenu":
                                                        x = bo;
                                                        break;
                                                    case "drag":
                                                    case "dragend":
                                                    case "dragenter":
                                                    case "dragexit":
                                                    case "dragleave":
                                                    case "dragover":
                                                    case "dragstart":
                                                    case "drop":
                                                        x = om;
                                                        break;
                                                    case "touchcancel":
                                                    case "touchend":
                                                    case "touchmove":
                                                    case "touchstart":
                                                        x = Tm;
                                                        break;
                                                    case Xo:
                                                    case Qo:
                                                    case Zo:
                                                        x = dm;
                                                        break;
                                                    case Lo:
                                                        x = Hm;
                                                        break;
                                                    case "scroll":
                                                    case "scrollend":
                                                        x = cm;
                                                        break;
                                                    case "wheel":
                                                        x = _m;
                                                        break;
                                                    case "copy":
                                                    case "cut":
                                                    case "paste":
                                                        x = ym;
                                                        break;
                                                    case "gotpointercapture":
                                                    case "lostpointercapture":
                                                    case "pointercancel":
                                                    case "pointerdown":
                                                    case "pointermove":
                                                    case "pointerout":
                                                    case "pointerover":
                                                    case "pointerup":
                                                        x = xo;
                                                        break;
                                                    case "toggle":
                                                    case "beforetoggle":
                                                        x = Om
                                                }
                                                var Q = (l & 4) !== 0,
                                                    dt = !Q && (t === "scroll" || t === "scrollend"),
                                                    y = Q ? g !== null ? g + "Capture" : null : g;
                                                Q = [];
                                                for (var m = v, h; m !== null;) {
                                                    var A = m;
                                                    if (h = A.stateNode, A = A.tag, A !== 5 && A !== 26 && A !== 27 || h === null || y === null || (A = Ka(m, y), A != null && Q.push(Tu(m, A, h))), dt) break;
                                                    m = m.return
                                                }
                                                0 < Q.length && (g = new x(g, B, null, e, z), H.push({
                                                    event: g,
                                                    listeners: Q
                                                }))
                                            }
                                        }
                                        if ((l & 7) === 0) {
                                            t: {
                                                if (g = t === "mouseover" || t === "pointerover", x = t === "mouseout" || t === "pointerout", g && e !== Ti && (B = e.relatedTarget || e.fromElement) && (ta(B) || B[Ie])) break t;
                                                if ((x || g) && (g = z.window === z ? z : (g = z.ownerDocument) ? g.defaultView || g.parentWindow : window, x ? (B = e.relatedTarget || e.toElement, x = v, B = B ? ta(B) : null, B !== null && (dt = G(B), Q = B.tag, B !== dt || Q !== 5 && Q !== 27 && Q !== 6) && (B = null)) : (x = null, B = v), x !== B)) {
                                                    if (Q = bo, A = "onMouseLeave", y = "onMouseEnter", m = "mouse", (t === "pointerout" || t === "pointerover") && (Q = xo, A = "onPointerLeave", y = "onPointerEnter", m = "pointer"), dt = x == null ? g : Va(x), h = B == null ? g : Va(B), g = new Q(A, m + "leave", x, e, z), g.target = dt, g.relatedTarget = h, A = null, ta(z) === v && (Q = new Q(y, m + "enter", B, e, z), Q.target = h, Q.relatedTarget = dt, A = Q), dt = A, x && B) l: {
                                                        for (Q = Dy, y = x, m = B, h = 0, A = y; A; A = Q(A)) h++;A = 0;
                                                        for (var X = m; X; X = Q(X)) A++;
                                                        for (; 0 < h - A;) y = Q(y),
                                                            h--;
                                                        for (; 0 < A - h;) m = Q(m),
                                                            A--;
                                                        for (; h--;) {
                                                            if (y === m || m !== null && y === m.alternate) {
                                                                Q = y;
                                                                break l
                                                            }
                                                            y = Q(y), m = Q(m)
                                                        }
                                                        Q = null
                                                    }
                                                    else Q = null;
                                                    x !== null && dd(H, g, x, Q, !1), B !== null && dt !== null && dd(H, dt, B, Q, !0)
                                                }
                                            }
                                            t: {
                                                if (g = v ? Va(v) : window, x = g.nodeName && g.nodeName.toLowerCase(), x === "select" || x === "input" && g.type === "file") var at = Do;
                                                else if (Mo(g))
                                                    if (Oo) at = Xm;
                                                    else {
                                                        at = Ym;
                                                        var q = qm
                                                        }
                                                else x = g.nodeName,
                                                    !x || x.toLowerCase() !== "input" || g.type !== "checkbox" && g.type !== "radio" ? v && zi(v.elementType) && (at = Do) : at = Gm;
                                                if (at && (at = at(t, v))) {
                                                    _o(H, at, e, z);
                                                    break t
                                                }
                                                q && q(t, g, v),
                                                    t === "focusout" && v && g.type === "number" && v.memoizedProps.value != null && Ei(g, "number", g.value)
                                            }
                                            switch (q = v ? Va(v) : window, t) {
                                                case "focusin":
                                                    (Mo(q) || q.contentEditable === "true") && (oa = q, qi = v, Ia = null);
                                                    break;
                                                case "focusout":
                                                    Ia = qi = oa = null;
                                                    break;
                                                case "mousedown":
                                                    Yi = !0;
                                                    break;
                                                case "contextmenu":
                                                case "mouseup":
                                                case "dragend":
                                                    Yi = !1, Yo(H, e, z);
                                                    break;
                                                case "selectionchange":
                                                    if (Zm) break;
                                                case "keydown":
                                                case "keyup":
                                                    Yo(H, e, z)
                                            }
                                            var w;
                                            if (Ci) t: {
                                                switch (t) {
                                                    case "compositionstart":
                                                        var tt = "onCompositionStart";
                                                        break t;
                                                    case "compositionend":
                                                        tt = "onCompositionEnd";
                                                        break t;
                                                    case "compositionupdate":
                                                        tt = "onCompositionUpdate";
                                                        break t
                                                }
                                                tt = void 0
                                            }
                                            else fa ? Ao(t, e) && (tt = "onCompositionEnd") : t === "keydown" && e.keyCode === 229 && (tt = "onCompositionStart");tt && (Eo && e.locale !== "ko" && (fa || tt !== "onCompositionStart" ? tt === "onCompositionEnd" && fa && (w = go()) : (ce = z, _i = "value" in ce ? ce.value : ce.textContent, fa = !0)), q = Xn(v, tt), 0 < q.length && (tt = new So(tt, t, null, e, z), H.push({
                                                event: tt,
                                                listeners: q
                                            }), w ? tt.data = w : (w = Ho(e), w !== null && (tt.data = w)))),
                                                (w = jm ? Cm(t, e) : Bm(t, e)) && (tt = Xn(v, "onBeforeInput"), 0 < tt.length && (q = new So("onBeforeInput", "beforeinput", null, e, z), H.push({
                                                event: q,
                                                listeners: tt
                                            }), q.data = w)),
                                                Ay(H, t, v, e, z)
                                        }
                                        sd(H, l)
                                    })
                                }

                                function Tu(t, l, e) {
                                    return {
                                        instance: t,
                                        listener: l,
                                        currentTarget: e
                                    }
                                }

                                function Xn(t, l) {
                                    for (var e = l + "Capture", a = []; t !== null;) {
                                        var u = t,
                                            n = u.stateNode;
                                        if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || n === null || (u = Ka(t, e), u != null && a.unshift(Tu(t, u, n)), u = Ka(t, l), u != null && a.push(Tu(t, u, n))), t.tag === 3) return a;
                                        t = t.return
                                    }
                                    return []
                                }

                                function Dy(t) {
                                    if (t === null) return null;
                                    do t = t.return; while (t && t.tag !== 5 && t.tag !== 27);
                                    return t || null
                                }

                                function dd(t, l, e, a, u) {
                                    for (var n = l._reactName, i = []; e !== null && e !== a;) {
                                        var c = e,
                                            o = c.alternate,
                                            v = c.stateNode;
                                        if (c = c.tag, o !== null && o === a) break;
                                        c !== 5 && c !== 26 && c !== 27 || v === null || (o = v, u ? (v = Ka(e, n), v != null && i.unshift(Tu(e, v, o))) : u || (v = Ka(e, n), v != null && i.push(Tu(e, v, o)))), e = e.return
                                    }
                                    i.length !== 0 && t.push({
                                        event: l,
                                        listeners: i
                                    })
                                }
                                var Oy = /\r\n?/g,
                                    Uy = /\u0000|\uFFFD/g;

                                function md(t) {
                                    return (typeof t == "string" ? t : "" + t).replace(Oy, `
`).replace(Uy, "")
                                }

                                function yd(t, l) {
                                    return l = md(l), md(t) === l
                                }

                                function rt(t, l, e, a, u, n) {
                                    switch (e) {
                                        case "children":
                                            typeof a == "string" ? l === "body" || l === "textarea" && a === "" || na(t, a) : (typeof a == "number" || typeof a == "bigint") && l !== "body" && na(t, "" + a);
                                            break;
                                        case "className":
                                            Lu(t, "class", a);
                                            break;
                                        case "tabIndex":
                                            Lu(t, "tabindex", a);
                                            break;
                                        case "dir":
                                        case "role":
                                        case "viewBox":
                                        case "width":
                                        case "height":
                                            Lu(t, e, a);
                                            break;
                                        case "style":
                                            yo(t, a, n);
                                            break;
                                        case "data":
                                            if (l !== "object") {
                                                Lu(t, "data", a);
                                                break
                                            }
                                        case "src":
                                        case "href":
                                            if (a === "" && (l !== "a" || e !== "href")) {
                                                t.removeAttribute(e);
                                                break
                                            }
                                            if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
                                                t.removeAttribute(e);
                                                break
                                            }
                                            a = Ku("" + a), t.setAttribute(e, a);
                                            break;
                                        case "action":
                                        case "formAction":
                                            if (typeof a == "function") {
                                                t.setAttribute(e, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
                                                break
                                            } else typeof n == "function" && (e === "formAction" ? (l !== "input" && rt(t, l, "name", u.name, u, null), rt(t, l, "formEncType", u.formEncType, u, null), rt(t, l, "formMethod", u.formMethod, u, null), rt(t, l, "formTarget", u.formTarget, u, null)) : (rt(t, l, "encType", u.encType, u, null), rt(t, l, "method", u.method, u, null), rt(t, l, "target", u.target, u, null)));
                                            if (a == null || typeof a == "symbol" || typeof a == "boolean") {
                                                t.removeAttribute(e);
                                                break
                                            }
                                            a = Ku("" + a), t.setAttribute(e, a);
                                            break;
                                        case "onClick":
                                            a != null && (t.onclick = Xl);
                                            break;
                                        case "onScroll":
                                            a != null && F("scroll", t);
                                            break;
                                        case "onScrollEnd":
                                            a != null && F("scrollend", t);
                                            break;
                                        case "dangerouslySetInnerHTML":
                                            if (a != null) {
                                                if (typeof a != "object" || !("__html" in a)) throw Error(s(61));
                                                if (e = a.__html, e != null) {
                                                    if (u.children != null) throw Error(s(60));
                                                    t.innerHTML = e
                                                }
                                            }
                                            break;
                                        case "multiple":
                                            t.multiple = a && typeof a != "function" && typeof a != "symbol";
                                            break;
                                        case "muted":
                                            t.muted = a && typeof a != "function" && typeof a != "symbol";
                                            break;
                                        case "suppressContentEditableWarning":
                                        case "suppressHydrationWarning":
                                        case "defaultValue":
                                        case "defaultChecked":
                                        case "innerHTML":
                                        case "ref":
                                            break;
                                        case "autoFocus":
                                            break;
                                        case "xlinkHref":
                                            if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
                                                t.removeAttribute("xlink:href");
                                                break
                                            }
                                            e = Ku("" + a), t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", e);
                                            break;
                                        case "contentEditable":
                                        case "spellCheck":
                                        case "draggable":
                                        case "value":
                                        case "autoReverse":
                                        case "externalResourcesRequired":
                                        case "focusable":
                                        case "preserveAlpha":
                                            a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(e, "" + a) : t.removeAttribute(e);
                                            break;
                                        case "inert":
                                        case "allowFullScreen":
                                        case "async":
                                        case "autoPlay":
                                        case "controls":
                                        case "default":
                                        case "defer":
                                        case "disabled":
                                        case "disablePictureInPicture":
                                        case "disableRemotePlayback":
                                        case "formNoValidate":
                                        case "hidden":
                                        case "loop":
                                        case "noModule":
                                        case "noValidate":
                                        case "open":
                                        case "playsInline":
                                        case "readOnly":
                                        case "required":
                                        case "reversed":
                                        case "scoped":
                                        case "seamless":
                                        case "itemScope":
                                            a && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(e, "") : t.removeAttribute(e);
                                            break;
                                        case "capture":
                                        case "download":
                                            a === !0 ? t.setAttribute(e, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(e, a) : t.removeAttribute(e);
                                            break;
                                        case "cols":
                                        case "rows":
                                        case "size":
                                        case "span":
                                            a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? t.setAttribute(e, a) : t.removeAttribute(e);
                                            break;
                                        case "rowSpan":
                                        case "start":
                                            a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? t.removeAttribute(e) : t.setAttribute(e, a);
                                            break;
                                        case "popover":
                                            F("beforetoggle", t), F("toggle", t), Zu(t, "popover", a);
                                            break;
                                        case "xlinkActuate":
                                            Gl(t, "http://www.w3.org/1999/xlink", "xlink:actuate", a);
                                            break;
                                        case "xlinkArcrole":
                                            Gl(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", a);
                                            break;
                                        case "xlinkRole":
                                            Gl(t, "http://www.w3.org/1999/xlink", "xlink:role", a);
                                            break;
                                        case "xlinkShow":
                                            Gl(t, "http://www.w3.org/1999/xlink", "xlink:show", a);
                                            break;
                                        case "xlinkTitle":
                                            Gl(t, "http://www.w3.org/1999/xlink", "xlink:title", a);
                                            break;
                                        case "xlinkType":
                                            Gl(t, "http://www.w3.org/1999/xlink", "xlink:type", a);
                                            break;
                                        case "xmlBase":
                                            Gl(t, "http://www.w3.org/XML/1998/namespace", "xml:base", a);
                                            break;
                                        case "xmlLang":
                                            Gl(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", a);
                                            break;
                                        case "xmlSpace":
                                            Gl(t, "http://www.w3.org/XML/1998/namespace", "xml:space", a);
                                            break;
                                        case "is":
                                            Zu(t, "is", a);
                                            break;
                                        case "innerText":
                                        case "textContent":
                                            break;
                                        default:
                                            (!(2 < e.length) || e[0] !== "o" && e[0] !== "O" || e[1] !== "n" && e[1] !== "N") && (e = nm.get(e) || e, Zu(t, e, a))
                                    }
                                }

                                function sf(t, l, e, a, u, n) {
                                    switch (e) {
                                        case "style":
                                            yo(t, a, n);
                                            break;
                                        case "dangerouslySetInnerHTML":
                                            if (a != null) {
                                                if (typeof a != "object" || !("__html" in a)) throw Error(s(61));
                                                if (e = a.__html, e != null) {
                                                    if (u.children != null) throw Error(s(60));
                                                    t.innerHTML = e
                                                }
                                            }
                                            break;
                                        case "children":
                                            typeof a == "string" ? na(t, a) : (typeof a == "number" || typeof a == "bigint") && na(t, "" + a);
                                            break;
                                        case "onScroll":
                                            a != null && F("scroll", t);
                                            break;
                                        case "onScrollEnd":
                                            a != null && F("scrollend", t);
                                            break;
                                        case "onClick":
                                            a != null && (t.onclick = Xl);
                                            break;
                                        case "suppressContentEditableWarning":
                                        case "suppressHydrationWarning":
                                        case "innerHTML":
                                        case "ref":
                                            break;
                                        case "innerText":
                                        case "textContent":
                                            break;
                                        default:
                                            if (!uo.hasOwnProperty(e)) t: {
                                                if (e[0] === "o" && e[1] === "n" && (u = e.endsWith("Capture"), l = e.slice(2, u ? e.length - 7 : void 0), n = t[It] || null, n = n != null ? n[e] : null, typeof n == "function" && t.removeEventListener(l, n, u), typeof a == "function")) {
                                                    typeof n != "function" && n !== null && (e in t ? t[e] = null : t.hasAttribute(e) && t.removeAttribute(e)), t.addEventListener(l, a, u);
                                                    break t
                                                }
                                                e in t ? t[e] = a : a === !0 ? t.setAttribute(e, "") : Zu(t, e, a)
                                            }
                                    }
                                }

                                function Zt(t, l, e) {
                                    switch (l) {
                                        case "div":
                                        case "span":
                                        case "svg":
                                        case "path":
                                        case "a":
                                        case "g":
                                        case "p":
                                        case "li":
                                            break;
                                        case "img":
                                            F("error", t), F("load", t);
                                            var a = !1,
                                                u = !1,
                                                n;
                                            for (n in e)
                                                if (e.hasOwnProperty(n)) {
                                                    var i = e[n];
                                                    if (i != null) switch (n) {
                                                        case "src":
                                                            a = !0;
                                                            break;
                                                        case "srcSet":
                                                            u = !0;
                                                            break;
                                                        case "children":
                                                        case "dangerouslySetInnerHTML":
                                                            throw Error(s(137, l));
                                                        default:
                                                            rt(t, l, n, i, e, null)
                                                    }
                                                } u && rt(t, l, "srcSet", e.srcSet, e, null), a && rt(t, l, "src", e.src, e, null);
                                            return;
                                        case "input":
                                            F("invalid", t);
                                            var c = n = i = u = null,
                                                o = null,
                                                v = null;
                                            for (a in e)
                                                if (e.hasOwnProperty(a)) {
                                                    var z = e[a];
                                                    if (z != null) switch (a) {
                                                        case "name":
                                                            u = z;
                                                            break;
                                                        case "type":
                                                            i = z;
                                                            break;
                                                        case "checked":
                                                            o = z;
                                                            break;
                                                        case "defaultChecked":
                                                            v = z;
                                                            break;
                                                        case "value":
                                                            n = z;
                                                            break;
                                                        case "defaultValue":
                                                            c = z;
                                                            break;
                                                        case "children":
                                                        case "dangerouslySetInnerHTML":
                                                            if (z != null) throw Error(s(137, l));
                                                            break;
                                                        default:
                                                            rt(t, l, a, z, e, null)
                                                    }
                                                } oo(t, n, c, o, v, i, u, !1);
                                            return;
                                        case "select":
                                            F("invalid", t), a = i = n = null;
                                            for (u in e)
                                                if (e.hasOwnProperty(u) && (c = e[u], c != null)) switch (u) {
                                                    case "value":
                                                        n = c;
                                                        break;
                                                    case "defaultValue":
                                                        i = c;
                                                        break;
                                                    case "multiple":
                                                        a = c;
                                                    default:
                                                        rt(t, l, u, c, e, null)
                                                }
                                            l = n, e = i, t.multiple = !!a, l != null ? ua(t, !!a, l, !1) : e != null && ua(t, !!a, e, !0);
                                            return;
                                        case "textarea":
                                            F("invalid", t), n = u = a = null;
                                            for (i in e)
                                                if (e.hasOwnProperty(i) && (c = e[i], c != null)) switch (i) {
                                                    case "value":
                                                        a = c;
                                                        break;
                                                    case "defaultValue":
                                                        u = c;
                                                        break;
                                                    case "children":
                                                        n = c;
                                                        break;
                                                    case "dangerouslySetInnerHTML":
                                                        if (c != null) throw Error(s(91));
                                                        break;
                                                    default:
                                                        rt(t, l, i, c, e, null)
                                                }
                                            ro(t, a, u, n);
                                            return;
                                        case "option":
                                            for (o in e) e.hasOwnProperty(o) && (a = e[o], a != null) && (o === "selected" ? t.selected = a && typeof a != "function" && typeof a != "symbol" : rt(t, l, o, a, e, null));
                                            return;
                                        case "dialog":
                                            F("beforetoggle", t), F("toggle", t), F("cancel", t), F("close", t);
                                            break;
                                        case "iframe":
                                        case "object":
                                            F("load", t);
                                            break;
                                        case "video":
                                        case "audio":
                                            for (a = 0; a < zu.length; a++) F(zu[a], t);
                                            break;
                                        case "image":
                                            F("error", t), F("load", t);
                                            break;
                                        case "details":
                                            F("toggle", t);
                                            break;
                                        case "embed":
                                        case "source":
                                        case "link":
                                            F("error", t), F("load", t);
                                        case "area":
                                        case "base":
                                        case "br":
                                        case "col":
                                        case "hr":
                                        case "keygen":
                                        case "meta":
                                        case "param":
                                        case "track":
                                        case "wbr":
                                        case "menuitem":
                                            for (v in e)
                                                if (e.hasOwnProperty(v) && (a = e[v], a != null)) switch (v) {
                                                    case "children":
                                                    case "dangerouslySetInnerHTML":
                                                        throw Error(s(137, l));
                                                    default:
                                                        rt(t, l, v, a, e, null)
                                                }
                                            return;
                                        default:
                                            if (zi(l)) {
                                                for (z in e) e.hasOwnProperty(z) && (a = e[z], a !== void 0 && sf(t, l, z, a, e, void 0));
                                                return
                                            }
                                    }
                                    for (c in e) e.hasOwnProperty(c) && (a = e[c], a != null && rt(t, l, c, a, e, null))
                                }

                                function jy(t, l, e, a) {
                                    switch (l) {
                                        case "div":
                                        case "span":
                                        case "svg":
                                        case "path":
                                        case "a":
                                        case "g":
                                        case "p":
                                        case "li":
                                            break;
                                        case "input":
                                            var u = null,
                                                n = null,
                                                i = null,
                                                c = null,
                                                o = null,
                                                v = null,
                                                z = null;
                                            for (x in e) {
                                                var H = e[x];
                                                if (e.hasOwnProperty(x) && H != null) switch (x) {
                                                    case "checked":
                                                        break;
                                                    case "value":
                                                        break;
                                                    case "defaultValue":
                                                        o = H;
                                                    default:
                                                        a.hasOwnProperty(x) || rt(t, l, x, null, a, H)
                                                }
                                            }
                                            for (var g in a) {
                                                var x = a[g];
                                                if (H = e[g], a.hasOwnProperty(g) && (x != null || H != null)) switch (g) {
                                                    case "type":
                                                        n = x;
                                                        break;
                                                    case "name":
                                                        u = x;
                                                        break;
                                                    case "checked":
                                                        v = x;
                                                        break;
                                                    case "defaultChecked":
                                                        z = x;
                                                        break;
                                                    case "value":
                                                        i = x;
                                                        break;
                                                    case "defaultValue":
                                                        c = x;
                                                        break;
                                                    case "children":
                                                    case "dangerouslySetInnerHTML":
                                                        if (x != null) throw Error(s(137, l));
                                                        break;
                                                    default:
                                                        x !== H && rt(t, l, g, x, a, H)
                                                }
                                            }
                                            xi(t, i, c, o, v, z, n, u);
                                            return;
                                        case "select":
                                            x = i = c = g = null;
                                            for (n in e)
                                                if (o = e[n], e.hasOwnProperty(n) && o != null) switch (n) {
                                                    case "value":
                                                        break;
                                                    case "multiple":
                                                        x = o;
                                                    default:
                                                        a.hasOwnProperty(n) || rt(t, l, n, null, a, o)
                                                }
                                            for (u in a)
                                                if (n = a[u], o = e[u], a.hasOwnProperty(u) && (n != null || o != null)) switch (u) {
                                                    case "value":
                                                        g = n;
                                                        break;
                                                    case "defaultValue":
                                                        c = n;
                                                        break;
                                                    case "multiple":
                                                        i = n;
                                                    default:
                                                        n !== o && rt(t, l, u, n, a, o)
                                                }
                                            l = c, e = i, a = x, g != null ? ua(t, !!e, g, !1) : !!a != !!e && (l != null ? ua(t, !!e, l, !0) : ua(t, !!e, e ? [] : "", !1));
                                            return;
                                        case "textarea":
                                            x = g = null;
                                            for (c in e)
                                                if (u = e[c], e.hasOwnProperty(c) && u != null && !a.hasOwnProperty(c)) switch (c) {
                                                    case "value":
                                                        break;
                                                    case "children":
                                                        break;
                                                    default:
                                                        rt(t, l, c, null, a, u)
                                                }
                                            for (i in a)
                                                if (u = a[i], n = e[i], a.hasOwnProperty(i) && (u != null || n != null)) switch (i) {
                                                    case "value":
                                                        g = u;
                                                        break;
                                                    case "defaultValue":
                                                        x = u;
                                                        break;
                                                    case "children":
                                                        break;
                                                    case "dangerouslySetInnerHTML":
                                                        if (u != null) throw Error(s(91));
                                                        break;
                                                    default:
                                                        u !== n && rt(t, l, i, u, a, n)
                                                }
                                            so(t, g, x);
                                            return;
                                        case "option":
                                            for (var B in e) g = e[B], e.hasOwnProperty(B) && g != null && !a.hasOwnProperty(B) && (B === "selected" ? t.selected = !1 : rt(t, l, B, null, a, g));
                                            for (o in a) g = a[o], x = e[o], a.hasOwnProperty(o) && g !== x && (g != null || x != null) && (o === "selected" ? t.selected = g && typeof g != "function" && typeof g != "symbol" : rt(t, l, o, g, a, x));
                                            return;
                                        case "img":
                                        case "link":
                                        case "area":
                                        case "base":
                                        case "br":
                                        case "col":
                                        case "embed":
                                        case "hr":
                                        case "keygen":
                                        case "meta":
                                        case "param":
                                        case "source":
                                        case "track":
                                        case "wbr":
                                        case "menuitem":
                                            for (var Q in e) g = e[Q], e.hasOwnProperty(Q) && g != null && !a.hasOwnProperty(Q) && rt(t, l, Q, null, a, g);
                                            for (v in a)
                                                if (g = a[v], x = e[v], a.hasOwnProperty(v) && g !== x && (g != null || x != null)) switch (v) {
                                                    case "children":
                                                    case "dangerouslySetInnerHTML":
                                                        if (g != null) throw Error(s(137, l));
                                                        break;
                                                    default:
                                                        rt(t, l, v, g, a, x)
                                                }
                                            return;
                                        default:
                                            if (zi(l)) {
                                                for (var dt in e) g = e[dt], e.hasOwnProperty(dt) && g !== void 0 && !a.hasOwnProperty(dt) && sf(t, l, dt, void 0, a, g);
                                                for (z in a) g = a[z], x = e[z], !a.hasOwnProperty(z) || g === x || g === void 0 && x === void 0 || sf(t, l, z, g, a, x);
                                                return
                                            }
                                    }
                                    for (var y in e) g = e[y], e.hasOwnProperty(y) && g != null && !a.hasOwnProperty(y) && rt(t, l, y, null, a, g);
                                    for (H in a) g = a[H], x = e[H], !a.hasOwnProperty(H) || g === x || g == null && x == null || rt(t, l, H, g, a, x)
                                }

                                function hd(t) {
                                    switch (t) {
                                        case "css":
                                        case "script":
                                        case "font":
                                        case "img":
                                        case "image":
                                        case "input":
                                        case "link":
                                            return !0;
                                        default:
                                            return !1
                                    }
                                }

                                function Cy() {
                                    if (typeof performance.getEntriesByType == "function") {
                                        for (var t = 0, l = 0, e = performance.getEntriesByType("resource"), a = 0; a < e.length; a++) {
                                            var u = e[a],
                                                n = u.transferSize,
                                                i = u.initiatorType,
                                                c = u.duration;
                                            if (n && c && hd(i)) {
                                                for (i = 0, c = u.responseEnd, a += 1; a < e.length; a++) {
                                                    var o = e[a],
                                                        v = o.startTime;
                                                    if (v > c) break;
                                                    var z = o.transferSize,
                                                        H = o.initiatorType;
                                                    z && hd(H) && (o = o.responseEnd, i += z * (o < c ? 1 : (c - v) / (o - v)))
                                                }
                                                if (--a, l += 8 * (n + i) / (u.duration / 1e3), t++, 10 < t) break
                                            }
                                        }
                                        if (0 < t) return l / t / 1e6
                                    }
                                    return navigator.connection && (t = navigator.connection.downlink, typeof t == "number") ? t : 5
                                }
                                var rf = null,
                                    df = null;

                                function Qn(t) {
                                    return t.nodeType === 9 ? t : t.ownerDocument
                                }

                                function vd(t) {
                                    switch (t) {
                                        case "http://www.w3.org/2000/svg":
                                            return 1;
                                        case "http://www.w3.org/1998/Math/MathML":
                                            return 2;
                                        default:
                                            return 0
                                    }
                                }

                                function gd(t, l) {
                                    if (t === 0) switch (l) {
                                        case "svg":
                                            return 1;
                                        case "math":
                                            return 2;
                                        default:
                                            return 0
                                    }
                                    return t === 1 && l === "foreignObject" ? 0 : t
                                }

                                function mf(t, l) {
                                    return t === "textarea" || t === "noscript" || typeof l.children == "string" || typeof l.children == "number" || typeof l.children == "bigint" || typeof l.dangerouslySetInnerHTML == "object" && l.dangerouslySetInnerHTML !== null && l.dangerouslySetInnerHTML.__html != null
                                }
                                var yf = null;

                                function By() {
                                    var t = window.event;
                                    return t && t.type === "popstate" ? t === yf ? !1 : (yf = t, !0) : (yf = null, !1)
                                }
                                var pd = typeof setTimeout == "function" ? setTimeout : void 0,
                                    Ry = typeof clearTimeout == "function" ? clearTimeout : void 0,
                                    bd = typeof Promise == "function" ? Promise : void 0,
                                    Ny = typeof queueMicrotask == "function" ? queueMicrotask : typeof bd < "u" ? function(t) {
                                        return bd.resolve(null).then(t).catch(qy)
                                    } : pd;

                                function qy(t) {
                                    setTimeout(function() {
                                        throw t
                                    })
                                }

                                function Te(t) {
                                    return t === "head"
                                }

                                function Sd(t, l) {
                                    var e = l,
                                        a = 0;
                                    do {
                                        var u = e.nextSibling;
                                        if (t.removeChild(e), u && u.nodeType === 8)
                                            if (e = u.data, e === "/$" || e === "/&") {
                                                if (a === 0) {
                                                    t.removeChild(u), Na(l);
                                                    return
                                                }
                                                a--
                                            } else if (e === "$" || e === "$?" || e === "$~" || e === "$!" || e === "&") a++;
                                            else if (e === "html") Au(t.ownerDocument.documentElement);
                                            else if (e === "head") {
                                                e = t.ownerDocument.head, Au(e);
                                                for (var n = e.firstChild; n;) {
                                                    var i = n.nextSibling,
                                                        c = n.nodeName;
                                                    n[La] || c === "SCRIPT" || c === "STYLE" || c === "LINK" && n.rel.toLowerCase() === "stylesheet" || e.removeChild(n), n = i
                                                }
                                            } else e === "body" && Au(t.ownerDocument.body);
                                        e = u
                                    } while (e);
                                    Na(l)
                                }

                                function xd(t, l) {
                                    var e = t;
                                    t = 0;
                                    do {
                                        var a = e.nextSibling;
                                        if (e.nodeType === 1 ? l ? (e._stashedDisplay = e.style.display, e.style.display = "none") : (e.style.display = e._stashedDisplay || "", e.getAttribute("style") === "" && e.removeAttribute("style")) : e.nodeType === 3 && (l ? (e._stashedText = e.nodeValue, e.nodeValue = "") : e.nodeValue = e._stashedText || ""), a && a.nodeType === 8)
                                            if (e = a.data, e === "/$") {
                                                if (t === 0) break;
                                                t--
                                            } else e !== "$" && e !== "$?" && e !== "$~" && e !== "$!" || t++;
                                        e = a
                                    } while (e)
                                }

                                function hf(t) {
                                    var l = t.firstChild;
                                    for (l && l.nodeType === 10 && (l = l.nextSibling); l;) {
                                        var e = l;
                                        switch (l = l.nextSibling, e.nodeName) {
                                            case "HTML":
                                            case "HEAD":
                                            case "BODY":
                                                hf(e), bi(e);
                                                continue;
                                            case "SCRIPT":
                                            case "STYLE":
                                                continue;
                                            case "LINK":
                                                if (e.rel.toLowerCase() === "stylesheet") continue
                                        }
                                        t.removeChild(e)
                                    }
                                }

                                    function Yy(t, l, e, a) {
                                        for (; t.nodeType === 1;) {
                                            var u = e;
                                            if (t.nodeName.toLowerCase() !== l.toLowerCase()) {
                                                if (!a && (t.nodeName !== "INPUT" || t.type !== "hidden")) break
                                            } else if (a) {
                                                if (!t[La]) switch (l) {
                                                    case "meta":
                                                        if (!t.hasAttribute("itemprop")) break;
                                                        return t;
                                                    case "link":
                                                        if (n = t.getAttribute("rel"), n === "stylesheet" && t.hasAttribute("data-precedence")) break;
                                                        if (n !== u.rel || t.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) || t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) || t.getAttribute("title") !== (u.title == null ? null : u.title)) break;
                                                        return t;
                                                    case "style":
                                                        if (t.hasAttribute("data-precedence")) break;
                                                        return t;
                                                    case "script":
                                                        if (n = t.getAttribute("src"), (n !== (u.src == null ? null : u.src) || t.getAttribute("type") !== (u.type == null ? null : u.type) || t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) && n && t.hasAttribute("async") && !t.hasAttribute("itemprop")) break;
                                                        return t;
                                                    default:
                                                        return t
                                                }
                                            } else if (l === "input" && t.type === "hidden") {
                                                var n = u.name == null ? null : "" + u.name;
                                                if (u.type === "hidden" && t.getAttribute("name") === n) return t
                                            } else return t;
                                            if (t = _l(t.nextSibling), t === null) break
                                        }
                                        return null
                                    }

                                    function Gy(t, l, e) {
                                        if (l === "") return null;
                                        for (; t.nodeType !== 3;)
                                            if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = _l(t.nextSibling), t === null)) return null;
                                        return t
                                    }

                                    function Ed(t, l) {
                                        for (; t.nodeType !== 8;)
                                            if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !l || (t = _l(t.nextSibling), t === null)) return null;
                                        return t
                                    }

                                    function vf(t) {
                                        return t.data === "$?" || t.data === "$~"
                                    }

                                    function gf(t) {
                                        return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState !== "loading"
                                    }

                                    function Xy(t, l) {
                                        var e = t.ownerDocument;
                                        if (t.data === "$~") t._reactRetry = l;
                                        else if (t.data !== "$?" || e.readyState !== "loading") l();
                                        else {
                                            var a = function() {
                                                l(), e.removeEventListener("DOMContentLoaded", a)
                                            };
                                            e.addEventListener("DOMContentLoaded", a), t._reactRetry = a
                                        }
                                    }

                                    function _l(t) {
                                        for (; t != null; t = t.nextSibling) {
                                            var l = t.nodeType;
                                            if (l === 1 || l === 3) break;
                                            if (l === 8) {
                                                if (l = t.data, l === "$" || l === "$!" || l === "$?" || l === "$~" || l === "&" || l === "F!" || l === "F") break;
                                                if (l === "/$" || l === "/&") return null
                                            }
                                        }
                                        return t
                                    }
                                    var pf = null;

                                    function zd(t) {
                                        t = t.nextSibling;
                                        for (var l = 0; t;) {
                                            if (t.nodeType === 8) {
                                                var e = t.data;
                                                if (e === "/$" || e === "/&") {
                                                    if (l === 0) return _l(t.nextSibling);
                                                    l--
                                                } else e !== "$" && e !== "$!" && e !== "$?" && e !== "$~" && e !== "&" || l++
                                            }
                                            t = t.nextSibling
                                        }
                                        return null
                                    }

                                    function Td(t) {
                                        t = t.previousSibling;
                                        for (var l = 0; t;) {
                                            if (t.nodeType === 8) {
                                                var e = t.data;
                                                if (e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&") {
                                                    if (l === 0) return t;
                                                    l--
                                                } else e !== "/$" && e !== "/&" || l++
                                            }
                                            t = t.previousSibling
                                        }
                                        return null
                                    }

                                    function Ad(t, l, e) {
                                        switch (l = Qn(e), t) {
                                            case "html":
                                                if (t = l.documentElement, !t) throw Error(s(452));
                                                return t;
                                            case "head":
                                                if (t = l.head, !t) throw Error(s(453));
                                                return t;
                                            case "body":
                                                if (t = l.body, !t) throw Error(s(454));
                                                return t;
                                            default:
                                                throw Error(s(451))
                                        }
                                    }

                                    function Au(t) {
                                        for (var l = t.attributes; l.length;) t.removeAttributeNode(l[0]);
                                        bi(t)
                                    }
                                    var Dl = new Map,
                                        Hd = new Set;

                                    function Zn(t) {
                                        return typeof t.getRootNode == "function" ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument
                                    }
                                    var ee = U.d;
                                    U.d = {
                                        f: Qy,
                                        r: Zy,
                                        D: Ly,
                                        C: Vy,
                                        L: Ky,
                                        m: Jy,
                                        X: Wy,
                                        S: wy,
                                        M: ky
                                    };

                                    function Qy() {
                                        var t = ee.f(),
                                            l = Cn();
                                        return t || l
                                    }

                                    function Zy(t) {
                                        var l = la(t);
                                        l !== null && l.tag === 5 && l.type === "form" ? Ls(l) : ee.r(t)
                                    }
                                    var Ca = typeof document > "u" ? null : document;

                                    function Md(t, l, e) {
                                        var a = Ca;
                                        if (a && typeof l == "string" && l) {
                                            var u = xl(l);
                                            u = 'link[rel="' + t + '"][href="' + u + '"]', typeof e == "string" && (u += '[crossorigin="' + e + '"]'), Hd.has(u) || (Hd.add(u), t = {
                                                rel: t,
                                                crossOrigin: e,
                                                href: l
                                            }, a.querySelector(u) === null && (l = a.createElement("link"), Zt(l, "link", t), Bt(l), a.head.appendChild(l)))
                                        }
                                    }

                                    function Ly(t) {
                                        ee.D(t), Md("dns-prefetch", t, null)
                                    }

                                    function Vy(t, l) {
                                        ee.C(t, l), Md("preconnect", t, l)
                                    }

                                    function Ky(t, l, e) {
                                        ee.L(t, l, e);
                                        var a = Ca;
                                        if (a && t && l) {
                                            var u = 'link[rel="preload"][as="' + xl(l) + '"]';
                                            l === "image" && e && e.imageSrcSet ? (u += '[imagesrcset="' + xl(e.imageSrcSet) + '"]', typeof e.imageSizes == "string" && (u += '[imagesizes="' + xl(e.imageSizes) + '"]')) : u += '[href="' + xl(t) + '"]';
                                            var n = u;
                                            switch (l) {
                                                case "style":
                                                    n = Ba(t);
                                                    break;
                                                case "script":
                                                    n = Ra(t)
                                            }
                                            Dl.has(n) || (t = R({
                                                rel: "preload",
                                                href: l === "image" && e && e.imageSrcSet ? void 0 : t,
                                                as: l
                                            }, e), Dl.set(n, t), a.querySelector(u) !== null || l === "style" && a.querySelector(Hu(n)) || l === "script" && a.querySelector(Mu(n)) || (l = a.createElement("link"), Zt(l, "link", t), Bt(l), a.head.appendChild(l)))
                                        }
                                    }

                                    function Jy(t, l) {
                                        ee.m(t, l);
                                        var e = Ca;
                                        if (e && t) {
                                            var a = l && typeof l.as == "string" ? l.as : "script",
                                                u = 'link[rel="modulepreload"][as="' + xl(a) + '"][href="' + xl(t) + '"]',
                                                n = u;
                                            switch (a) {
                                                case "audioworklet":
                                                case "paintworklet":
                                                case "serviceworker":
                                                case "sharedworker":
                                                case "worker":
                                                case "script":
                                                    n = Ra(t)
                                            }
                                            if (!Dl.has(n) && (t = R({
                                                rel: "modulepreload",
                                                href: t
                                            }, l), Dl.set(n, t), e.querySelector(u) === null)) {
                                                switch (a) {
                                                    case "audioworklet":
                                                    case "paintworklet":
                                                    case "serviceworker":
                                                    case "sharedworker":
                                                    case "worker":
                                                    case "script":
                                                        if (e.querySelector(Mu(n))) return
                                                }
                                                a = e.createElement("link"), Zt(a, "link", t), Bt(a), e.head.appendChild(a)
                                            }
                                        }
                                    }

                                    function wy(t, l, e) {
                                        ee.S(t, l, e);
                                        var a = Ca;
                                        if (a && t) {
                                            var u = ea(a).hoistableStyles,
                                                n = Ba(t);
                                            l = l || "default";
                                            var i = u.get(n);
                                            if (!i) {
                                                var c = {
                                                    loading: 0,
                                                    preload: null
                                                };
                                                if (i = a.querySelector(Hu(n))) c.loading = 5;
                                                else {
                                                    t = R({
                                                        rel: "stylesheet",
                                                        href: t,
                                                        "data-precedence": l
                                                    }, e), (e = Dl.get(n)) && bf(t, e);
                                                    var o = i = a.createElement("link");
                                                    Bt(o), Zt(o, "link", t), o._p = new Promise(function(v, z) {
                                                        o.onload = v, o.onerror = z
                                                    }), o.addEventListener("load", function() {
                                                        c.loading |= 1
                                                    }), o.addEventListener("error", function() {
                                                        c.loading |= 2
                                                    }), c.loading |= 4, Ln(i, l, a)
                                                }
                                                i = {
                                                    type: "stylesheet",
                                                    instance: i,
                                                    count: 1,
                                                    state: c
                                                }, u.set(n, i)
                                            }
                                        }
                                    }

                                    function Wy(t, l) {
                                        ee.X(t, l);
                                        var e = Ca;
                                        if (e && t) {
                                            var a = ea(e).hoistableScripts,
                                                u = Ra(t),
                                                n = a.get(u);
                                            n || (n = e.querySelector(Mu(u)), n || (t = R({
                                                src: t,
                                                async: !0
                                            }, l), (l = Dl.get(u)) && Sf(t, l), n = e.createElement("script"), Bt(n), Zt(n, "link", t), e.head.appendChild(n)), n = {
                                                type: "script",
                                                instance: n,
                                                count: 1,
                                                state: null
                                            }, a.set(u, n))
                                        }
                                    }

                                    function ky(t, l) {
                                        ee.M(t, l);
                                        var e = Ca;
                                        if (e && t) {
                                            var a = ea(e).hoistableScripts,
                                                u = Ra(t),
                                                n = a.get(u);
                                            n || (n = e.querySelector(Mu(u)), n || (t = R({
                                                src: t,
                                                async: !0,
                                                type: "module"
                                            }, l), (l = Dl.get(u)) && Sf(t, l), n = e.createElement("script"), Bt(n), Zt(n, "link", t), e.head.appendChild(n)), n = {
                                                type: "script",
                                                instance: n,
                                                count: 1,
                                                state: null
                                            }, a.set(u, n))
                                        }
                                    }

                                    function _d(t, l, e, a) {
                                        var u = (u = k.current) ? Zn(u) : null;
                                        if (!u) throw Error(s(446));
                                        switch (t) {
                                            case "meta":
                                            case "title":
                                                return null;
                                            case "style":
                                                return typeof e.precedence == "string" && typeof e.href == "string" ? (l = Ba(e.href), e = ea(u).hoistableStyles, a = e.get(l), a || (a = {
                                                    type: "style",
                                                    instance: null,
                                                    count: 0,
                                                    state: null
                                                }, e.set(l, a)), a) : {
                                                    type: "void",
                                                    instance: null,
                                                    count: 0,
                                                    state: null
                                                };
                                            case "link":
                                                if (e.rel === "stylesheet" && typeof e.href == "string" && typeof e.precedence == "string") {
                                                    t = Ba(e.href);
                                                    var n = ea(u).hoistableStyles,
                                                        i = n.get(t);
                                                    if (i || (u = u.ownerDocument || u, i = {
                                                        type: "stylesheet",
                                                        instance: null,
                                                        count: 0,
                                                        state: {
                                                            loading: 0,
                                                            preload: null
                                                        }
                                                    }, n.set(t, i), (n = u.querySelector(Hu(t))) && !n._p && (i.instance = n, i.state.loading = 5), Dl.has(t) || (e = {
                                                        rel: "preload",
                                                        as: "style",
                                                        href: e.href,
                                                        crossOrigin: e.crossOrigin,
                                                        integrity: e.integrity,
                                                        media: e.media,
                                                        hrefLang: e.hrefLang,
                                                        referrerPolicy: e.referrerPolicy
                                                    }, Dl.set(t, e), n || $y(u, t, e, i.state))), l && a === null) throw Error(s(528, ""));
                                                    return i
                                                }
                                                if (l && a !== null) throw Error(s(529, ""));
                                                return null;
                                            case "script":
                                                return l = e.async, e = e.src, typeof e == "string" && l && typeof l != "function" && typeof l != "symbol" ? (l = Ra(e), e = ea(u).hoistableScripts, a = e.get(l), a || (a = {
                                                    type: "script",
                                                    instance: null,
                                                    count: 0,
                                                    state: null
                                                }, e.set(l, a)), a) : {
                                                    type: "void",
                                                    instance: null,
                                                    count: 0,
                                                    state: null
                                                };
                                            default:
                                                throw Error(s(444, t))
                                        }
                                    }

                                    function Ba(t) {
                                        return 'href="' + xl(t) + '"'
                                    }

                                    function Hu(t) {
                                        return 'link[rel="stylesheet"][' + t + "]"
                                    }

                                    function Dd(t) {
                                        return R({}, t, {
                                            "data-precedence": t.precedence,
                                            precedence: null
                                        })
                                    }

                                    function $y(t, l, e, a) {
                                        t.querySelector('link[rel="preload"][as="style"][' + l + "]") ? a.loading = 1 : (l = t.createElement("link"), a.preload = l, l.addEventListener("load", function() {
                                            return a.loading |= 1
                                        }), l.addEventListener("error", function() {
                                            return a.loading |= 2
                                        }), Zt(l, "link", e), Bt(l), t.head.appendChild(l))
                                    }

                                    function Ra(t) {
                                        return '[src="' + xl(t) + '"]'
                                    }

                                    function Mu(t) {
                                        return "script[async]" + t
                                    }

                                    function Od(t, l, e) {
                                        if (l.count++, l.instance === null) switch (l.type) {
                                            case "style":
                                                var a = t.querySelector('style[data-href~="' + xl(e.href) + '"]');
                                                if (a) return l.instance = a, Bt(a), a;
                                                var u = R({}, e, {
                                                    "data-href": e.href,
                                                    "data-precedence": e.precedence,
                                                    href: null,
                                                    precedence: null
                                                });
                                                return a = (t.ownerDocument || t).createElement("style"), Bt(a), Zt(a, "style", u), Ln(a, e.precedence, t), l.instance = a;
                                            case "stylesheet":
                                                u = Ba(e.href);
                                                var n = t.querySelector(Hu(u));
                                                if (n) return l.state.loading |= 4, l.instance = n, Bt(n), n;
                                                a = Dd(e), (u = Dl.get(u)) && bf(a, u), n = (t.ownerDocument || t).createElement("link"), Bt(n);
                                                var i = n;
                                                return i._p = new Promise(function(c, o) {
                                                    i.onload = c, i.onerror = o
                                                }), Zt(n, "link", a), l.state.loading |= 4, Ln(n, e.precedence, t), l.instance = n;
                                            case "script":
                                                return n = Ra(e.src), (u = t.querySelector(Mu(n))) ? (l.instance = u, Bt(u), u) : (a = e, (u = Dl.get(n)) && (a = R({}, e), Sf(a, u)), t = t.ownerDocument || t, u = t.createElement("script"), Bt(u), Zt(u, "link", a), t.head.appendChild(u), l.instance = u);
                                            case "void":
                                                return null;
                                            default:
                                                throw Error(s(443, l.type))
                                        } else l.type === "stylesheet" && (l.state.loading & 4) === 0 && (a = l.instance, l.state.loading |= 4, Ln(a, e.precedence, t));
                                        return l.instance
                                    }

                                    function Ln(t, l, e) {
                                        for (var a = e.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), u = a.length ? a[a.length - 1] : null, n = u, i = 0; i < a.length; i++) {
                                            var c = a[i];
                                            if (c.dataset.precedence === l) n = c;
                                            else if (n !== u) break
                                        }
                                        n ? n.parentNode.insertBefore(t, n.nextSibling) : (l = e.nodeType === 9 ? e.head : e, l.insertBefore(t, l.firstChild))
                                    }

                                    function bf(t, l) {
                                        t.crossOrigin == null && (t.crossOrigin = l.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = l.referrerPolicy), t.title == null && (t.title = l.title)
                                    }

                                    function Sf(t, l) {
                                        t.crossOrigin == null && (t.crossOrigin = l.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = l.referrerPolicy), t.integrity == null && (t.integrity = l.integrity)
                                    }
                                    var Vn = null;

                                    function Ud(t, l, e) {
                                        if (Vn === null) {
                                            var a = new Map,
                                                u = Vn = new Map;
                                            u.set(e, a)
                                        } else u = Vn, a = u.get(e), a || (a = new Map, u.set(e, a));
                                        if (a.has(t)) return a;
                                        for (a.set(t, null), e = e.getElementsByTagName(t), u = 0; u < e.length; u++) {
                                            var n = e[u];
                                            if (!(n[La] || n[Yt] || t === "link" && n.getAttribute("rel") === "stylesheet") && n.namespaceURI !== "http://www.w3.org/2000/svg") {
                                                var i = n.getAttribute(l) || "";
                                                i = t + i;
                                                var c = a.get(i);
                                                c ? c.push(n) : a.set(i, [n])
                                            }
                                        }
                                        return a
                                    }

                                    function jd(t, l, e) {
                                        t = t.ownerDocument || t, t.head.insertBefore(e, l === "title" ? t.querySelector("head > title") : null)
                                    }

                                    function Fy(t, l, e) {
                                        if (e === 1 || l.itemProp != null) return !1;
                                        switch (t) {
                                            case "meta":
                                            case "title":
                                                return !0;
                                            case "style":
                                                if (typeof l.precedence != "string" || typeof l.href != "string" || l.href === "") break;
                                                return !0;
                                            case "link":
                                                if (typeof l.rel != "string" || typeof l.href != "string" || l.href === "" || l.onLoad || l.onError) break;
                                                return l.rel === "stylesheet" ? (t = l.disabled, typeof l.precedence == "string" && t == null) : !0;
                                            case "script":
                                                if (l.async && typeof l.async != "function" && typeof l.async != "symbol" && !l.onLoad && !l.onError && l.src && typeof l.src == "string") return !0
                                        }
                                        return !1
                                    }

                                    function Cd(t) {
                                        return !(t.type === "stylesheet" && (t.state.loading & 3) === 0)
                                    }

                                    function Py(t, l, e, a) {
                                        if (e.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (e.state.loading & 4) === 0) {
                                            if (e.instance === null) {
                                                var u = Ba(a.href),
                                                    n = l.querySelector(Hu(u));
                                                if (n) {
                                                    l = n._p, l !== null && typeof l == "object" && typeof l.then == "function" && (t.count++, t = Kn.bind(t), l.then(t, t)), e.state.loading |= 4, e.instance = n, Bt(n);
                                                    return
                                                }
                                                n = l.ownerDocument || l, a = Dd(a), (u = Dl.get(u)) && bf(a, u), n = n.createElement("link"), Bt(n);
                                                var i = n;
                                                i._p = new Promise(function(c, o) {
                                                    i.onload = c, i.onerror = o
                                                }), Zt(n, "link", a), e.instance = n
                                            }
                                            t.stylesheets === null && (t.stylesheets = new Map), t.stylesheets.set(e, l), (l = e.state.preload) && (e.state.loading & 3) === 0 && (t.count++, e = Kn.bind(t), l.addEventListener("load", e), l.addEventListener("error", e))
                                        }
                                    }
                                    var xf = 0;

                                    function Iy(t, l) {
                                        return t.stylesheets && t.count === 0 && wn(t, t.stylesheets), 0 < t.count || 0 < t.imgCount ? function(e) {
                                            var a = setTimeout(function() {
                                                if (t.stylesheets && wn(t, t.stylesheets), t.unsuspend) {
                                                    var n = t.unsuspend;
                                                    t.unsuspend = null, n()
                                                }
                                            }, 6e4 + l);
                                            0 < t.imgBytes && xf === 0 && (xf = 62500 * Cy());
                                            var u = setTimeout(function() {
                                                if (t.waitingForImages = !1, t.count === 0 && (t.stylesheets && wn(t, t.stylesheets), t.unsuspend)) {
                                                    var n = t.unsuspend;
                                                    t.unsuspend = null, n()
                                                }
                                            }, (t.imgBytes > xf ? 50 : 800) + l);
                                            return t.unsuspend = e,
                                                function() {
                                                t.unsuspend = null, clearTimeout(a), clearTimeout(u)
                                            }
                                        } : null
                                    }

                                    function Kn() {
                                        if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
                                            if (this.stylesheets) wn(this, this.stylesheets);
                                            else if (this.unsuspend) {
                                                var t = this.unsuspend;
                                                this.unsuspend = null, t()
                                            }
                                        }
                                    }
                                    var Jn = null;

                                    function wn(t, l) {
                                        t.stylesheets = null, t.unsuspend !== null && (t.count++, Jn = new Map, l.forEach(th, t), Jn = null, Kn.call(t))
                                    }

                                    function th(t, l) {
                                        if (!(l.state.loading & 4)) {
                                            var e = Jn.get(t);
                                            if (e) var a = e.get(null);
                                            else {
                                                e = new Map, Jn.set(t, e);
                                                for (var u = t.querySelectorAll("link[data-precedence],style[data-precedence]"), n = 0; n < u.length; n++) {
                                                    var i = u[n];
                                                    (i.nodeName === "LINK" || i.getAttribute("media") !== "not all") && (e.set(i.dataset.precedence, i), a = i)
                                                }
                                                a && e.set(null, a)
                                            }
                                            u = l.instance, i = u.getAttribute("data-precedence"), n = e.get(i) || a, n === a && e.set(null, u), e.set(i, u), this.count++, a = Kn.bind(this), u.addEventListener("load", a), u.addEventListener("error", a), n ? n.parentNode.insertBefore(u, n.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(u, t.firstChild)), l.state.loading |= 4
                                        }
                                    }
                                    var _u = {
                                        $$typeof: Mt,
                                        Provider: null,
                                        Consumer: null,
                                        _currentValue: et,
                                        _currentValue2: et,
                                        _threadCount: 0
                                    };

                                    function lh(t, l, e, a, u, n, i, c, o) {
                                        this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = hi(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = hi(0), this.hiddenUpdates = hi(null), this.identifierPrefix = a, this.onUncaughtError = u, this.onCaughtError = n, this.onRecoverableError = i, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = o, this.incompleteTransitions = new Map
                                    }

                                    function Bd(t, l, e, a, u, n, i, c, o, v, z, H) {
                                        return t = new lh(t, l, e, i, o, v, z, H, c), l = 1, n === !0 && (l |= 24), n = rl(3, null, null, l), t.current = n, n.stateNode = t, l = Ii(), l.refCount++, t.pooledCache = l, l.refCount++, n.memoizedState = {
                                            element: a,
                                            isDehydrated: e,
                                            cache: l
                                        }, ac(n), t
                                    }

                                    function Rd(t) {
                                        return t ? (t = da, t) : da
                                    }

                                    function Nd(t, l, e, a, u, n) {
                                        u = Rd(u), a.context === null ? a.context = u : a.pendingContext = u, a = me(l), a.payload = {
                                            element: e
                                        }, n = n === void 0 ? null : n, n !== null && (a.callback = n), e = ye(t, a, l), e !== null && (nl(e, t, l), iu(e, t, l))
                                    }

                                    function qd(t, l) {
                                        if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
                                            var e = t.retryLane;
                                            t.retryLane = e !== 0 && e < l ? e : l
                                        }
                                    }

                                    function Ef(t, l) {
                                        qd(t, l), (t = t.alternate) && qd(t, l)
                                    }

                                    function Yd(t) {
                                        if (t.tag === 13 || t.tag === 31) {
                                            var l = qe(t, 67108864);
                                            l !== null && nl(l, t, 67108864), Ef(t, 67108864)
                                        }
                                    }

                                    function Gd(t) {
                                        if (t.tag === 13 || t.tag === 31) {
                                            var l = vl();
                                            l = vi(l);
                                            var e = qe(t, l);
                                            e !== null && nl(e, t, l), Ef(t, l)
                                        }
                                    }
                                    var Wn = !0;

                                    function eh(t, l, e, a) {
                                        var u = M.T;
                                        M.T = null;
                                        var n = U.p;
                                        try {
                                            U.p = 2, zf(t, l, e, a)
                                        } finally {
                                            U.p = n, M.T = u
                                        }
                                    }

                                    function ah(t, l, e, a) {
                                        var u = M.T;
                                        M.T = null;
                                        var n = U.p;
                                        try {
                                            U.p = 8, zf(t, l, e, a)
                                        } finally {
                                            U.p = n, M.T = u
                                        }
                                    }

                                    function zf(t, l, e, a) {
                                        if (Wn) {
                                            var u = Tf(a);
                                            if (u === null) of(t, l, a, kn, e), Qd(t, a);
                                            else if (nh(u, t, l, e, a)) a.stopPropagation();
                                            else if (Qd(t, a), l & 4 && -1 < uh.indexOf(t)) {
                                                for (; u !== null;) {
                                                    var n = la(u);
                                                    if (n !== null) switch (n.tag) {
                                                        case 3:
                                                            if (n = n.stateNode, n.current.memoizedState.isDehydrated) {
                                                                var i = je(n.pendingLanes);
                                                                if (i !== 0) {
                                                                    var c = n;
                                                                    for (c.pendingLanes |= 2, c.entangledLanes |= 2; i;) {
                                                                        var o = 1 << 31 - ol(i);
                                                                        c.entanglements[1] |= o, i &= ~o
                                                                    }
                                                                    ql(n), (it & 6) === 0 && (Un = cl() + 500, Eu(0))
                                                                }
                                                            }
                                                            break;
                                                        case 31:
                                                        case 13:
                                                            c = qe(n, 2), c !== null && nl(c, n, 2), Cn(), Ef(n, 2)
                                                    }
                                                    if (n = Tf(a), n === null && of(t, l, a, kn, e), n === u) break;
                                                    u = n
                                                }
                                                u !== null && a.stopPropagation()
                                            } else of(t, l, a, null, e)
                                        }
                                    }

                                    function Tf(t) {
                                        return t = Ai(t), Af(t)
                                    }
                                    var kn = null;

                                    function Af(t) {
                                        if (kn = null, t = ta(t), t !== null) {
                                            var l = G(t);
                                            if (l === null) t = null;
                                            else {
                                                var e = l.tag;
                                                if (e === 13) {
                                                    if (t = Z(l), t !== null) return t;
                                                    t = null
                                                } else if (e === 31) {
                                                    if (t = O(l), t !== null) return t;
                                                    t = null
                                                } else if (e === 3) {
                                                    if (l.stateNode.current.memoizedState.isDehydrated) return l.tag === 3 ? l.stateNode.containerInfo : null;
                                                    t = null
                                                } else l !== t && (t = null)
                                            }
                                        }
                                        return kn = t, null
                                    }

                                    function Xd(t) {
                                        switch (t) {
                                            case "beforetoggle":
                                            case "cancel":
                                            case "click":
                                            case "close":
                                            case "contextmenu":
                                            case "copy":
                                            case "cut":
                                            case "auxclick":
                                            case "dblclick":
                                            case "dragend":
                                            case "dragstart":
                                            case "drop":
                                            case "focusin":
                                            case "focusout":
                                            case "input":
                                            case "invalid":
                                            case "keydown":
                                            case "keypress":
                                            case "keyup":
                                            case "mousedown":
                                            case "mouseup":
                                            case "paste":
                                            case "pause":
                                            case "play":
                                            case "pointercancel":
                                            case "pointerdown":
                                            case "pointerup":
                                            case "ratechange":
                                            case "reset":
                                            case "resize":
                                            case "seeked":
                                            case "submit":
                                            case "toggle":
                                            case "touchcancel":
                                            case "touchend":
                                            case "touchstart":
                                            case "volumechange":
                                            case "change":
                                            case "selectionchange":
                                            case "textInput":
                                            case "compositionstart":
                                            case "compositionend":
                                            case "compositionupdate":
                                            case "beforeblur":
                                            case "afterblur":
                                            case "beforeinput":
                                            case "blur":
                                            case "fullscreenchange":
                                            case "focus":
                                            case "hashchange":
                                            case "popstate":
                                            case "select":
                                            case "selectstart":
                                                return 2;
                                            case "drag":
                                            case "dragenter":
                                            case "dragexit":
                                            case "dragleave":
                                            case "dragover":
                                            case "mousemove":
                                            case "mouseout":
                                            case "mouseover":
                                            case "pointermove":
                                            case "pointerout":
                                            case "pointerover":
                                            case "scroll":
                                            case "touchmove":
                                            case "wheel":
                                            case "mouseenter":
                                            case "mouseleave":
                                            case "pointerenter":
                                            case "pointerleave":
                                                return 8;
                                            case "message":
                                                switch (L0()) {
                                                    case wf:
                                                        return 2;
                                                    case Wf:
                                                        return 8;
                                                    case qu:
                                                    case V0:
                                                        return 32;
                                                    case kf:
                                                        return 268435456;
                                                    default:
                                                        return 32
                                                }
                                            default:
                                                return 32
                                        }
                                    }
                                    var Hf = !1,
                                        Ae = null,
                                        He = null,
                                        Me = null,
                                        Du = new Map,
                                        Ou = new Map,
                                        _e = [],
                                        uh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");

                                    function Qd(t, l) {
                                        switch (t) {
                                            case "focusin":
                                            case "focusout":
                                                Ae = null;
                                                break;
                                            case "dragenter":
                                            case "dragleave":
                                                He = null;
                                                break;
                                            case "mouseover":
                                            case "mouseout":
                                                Me = null;
                                                break;
                                            case "pointerover":
                                            case "pointerout":
                                                Du.delete(l.pointerId);
                                                break;
                                            case "gotpointercapture":
                                            case "lostpointercapture":
                                                Ou.delete(l.pointerId)
                                        }
                                    }

                                    function Uu(t, l, e, a, u, n) {
                                        return t === null || t.nativeEvent !== n ? (t = {
                                            blockedOn: l,
                                            domEventName: e,
                                            eventSystemFlags: a,
                                            nativeEvent: n,
                                            targetContainers: [u]
                                        }, l !== null && (l = la(l), l !== null && Yd(l)), t) : (t.eventSystemFlags |= a, l = t.targetContainers, u !== null && l.indexOf(u) === -1 && l.push(u), t)
                                    }

                                    function nh(t, l, e, a, u) {
                                        switch (l) {
                                            case "focusin":
                                                return Ae = Uu(Ae, t, l, e, a, u), !0;
                                            case "dragenter":
                                                return He = Uu(He, t, l, e, a, u), !0;
                                            case "mouseover":
                                                return Me = Uu(Me, t, l, e, a, u), !0;
                                            case "pointerover":
                                                var n = u.pointerId;
                                                return Du.set(n, Uu(Du.get(n) || null, t, l, e, a, u)), !0;
                                            case "gotpointercapture":
                                                return n = u.pointerId, Ou.set(n, Uu(Ou.get(n) || null, t, l, e, a, u)), !0
                                        }
                                        return !1
                                    }

                                    function Zd(t) {
                                        var l = ta(t.target);
                                        if (l !== null) {
                                            var e = G(l);
                                            if (e !== null) {
                                                if (l = e.tag, l === 13) {
                                                    if (l = Z(e), l !== null) {
                                                        t.blockedOn = l, lo(t.priority, function() {
                                                            Gd(e)
                                                        });
                                                        return
                                                    }
                                                } else if (l === 31) {
                                                    if (l = O(e), l !== null) {
                                                        t.blockedOn = l, lo(t.priority, function() {
                                                            Gd(e)
                                                        });
                                                        return
                                                    }
                                                } else if (l === 3 && e.stateNode.current.memoizedState.isDehydrated) {
                                                    t.blockedOn = e.tag === 3 ? e.stateNode.containerInfo : null;
                                                    return
                                                }
                                            }
                                        }
                                        t.blockedOn = null
                                    }

                                    function $n(t) {
                                        if (t.blockedOn !== null) return !1;
                                        for (var l = t.targetContainers; 0 < l.length;) {
                                            var e = Tf(t.nativeEvent);
                                            if (e === null) {
                                                e = t.nativeEvent;
                                                var a = new e.constructor(e.type, e);
                                                Ti = a, e.target.dispatchEvent(a), Ti = null
                                            } else return l = la(e), l !== null && Yd(l), t.blockedOn = e, !1;
                                            l.shift()
                                        }
                                        return !0
                                    }

                                    function Ld(t, l, e) {
                                        $n(t) && e.delete(l)
                                    }

                                    function ih() {
                                        Hf = !1, Ae !== null && $n(Ae) && (Ae = null), He !== null && $n(He) && (He = null), Me !== null && $n(Me) && (Me = null), Du.forEach(Ld), Ou.forEach(Ld)
                                    }

                                    function Fn(t, l) {
                                        t.blockedOn === l && (t.blockedOn = null, Hf || (Hf = !0, d.unstable_scheduleCallback(d.unstable_NormalPriority, ih)))
                                    }
                                    var Pn = null;

                                    function Vd(t) {
                                        Pn !== t && (Pn = t, d.unstable_scheduleCallback(d.unstable_NormalPriority, function() {
                                            Pn === t && (Pn = null);
                                            for (var l = 0; l < t.length; l += 3) {
                                                var e = t[l],
                                                    a = t[l + 1],
                                                    u = t[l + 2];
                                                if (typeof a != "function") {
                                                    if (Af(a || e) === null) continue;
                                                    break
                                                }
                                                var n = la(e);
                                                n !== null && (t.splice(l, 3), l -= 3, zc(n, {
                                                    pending: !0,
                                                    data: u,
                                                    method: e.method,
                                                    action: a
                                                }, a, u))
                                            }
                                        }))
                                    }

                                    function Na(t) {
                                        function l(o) {
                                            return Fn(o, t)
                                        }
                                        Ae !== null && Fn(Ae, t), He !== null && Fn(He, t), Me !== null && Fn(Me, t), Du.forEach(l), Ou.forEach(l);
                                        for (var e = 0; e < _e.length; e++) {
                                            var a = _e[e];
                                            a.blockedOn === t && (a.blockedOn = null)
                                        }
                                        for (; 0 < _e.length && (e = _e[0], e.blockedOn === null);) Zd(e), e.blockedOn === null && _e.shift();
                                        if (e = (t.ownerDocument || t).$$reactFormReplay, e != null)
                                            for (a = 0; a < e.length; a += 3) {
                                                var u = e[a],
                                                    n = e[a + 1],
                                                    i = u[It] || null;
                                                if (typeof n == "function") i || Vd(e);
                                                else if (i) {
                                                    var c = null;
                                                    if (n && n.hasAttribute("formAction")) {
                                                        if (u = n, i = n[It] || null) c = i.formAction;
                                                        else if (Af(u) !== null) continue
                                                    } else c = i.action;
                                                    typeof c == "function" ? e[a + 1] = c : (e.splice(a, 3), a -= 3), Vd(e)
                                                }
                                            }
                                    }

                                    function Kd() {
                                        function t(n) {
                                            n.canIntercept && n.info === "react-transition" && n.intercept({
                                                handler: function() {
                                                    return new Promise(function(i) {
                                                        return u = i
                                                    })
                                                },
                                                focusReset: "manual",
                                                scroll: "manual"
                                            })
                                        }

                                        function l() {
                                            u !== null && (u(), u = null), a || setTimeout(e, 20)
                                        }

                                        function e() {
                                            if (!a && !navigation.transition) {
                                                var n = navigation.currentEntry;
                                                n && n.url != null && navigation.navigate(n.url, {
                                                    state: n.getState(),
                                                    info: "react-transition",
                                                    history: "replace"
                                                })
                                            }
                                        }
                                        if (typeof navigation == "object") {
                                            var a = !1,
                                                u = null;
                                            return navigation.addEventListener("navigate", t), navigation.addEventListener("navigatesuccess", l), navigation.addEventListener("navigateerror", l), setTimeout(e, 100),
                                                function() {
                                                a = !0, navigation.removeEventListener("navigate", t), navigation.removeEventListener("navigatesuccess", l), navigation.removeEventListener("navigateerror", l), u !== null && (u(), u = null)
                                            }
                                        }
                                    }

                                    function Mf(t) {
                                        this._internalRoot = t
                                    }
                                    In.prototype.render = Mf.prototype.render = function(t) {
                                        var l = this._internalRoot;
                                        if (l === null) throw Error(s(409));
                                        var e = l.current,
                                            a = vl();
                                        Nd(e, a, t, l, null, null)
                                    }, In.prototype.unmount = Mf.prototype.unmount = function() {
                                        var t = this._internalRoot;
                                        if (t !== null) {
                                            this._internalRoot = null;
                                            var l = t.containerInfo;
                                            Nd(t.current, 2, null, t, null, null), Cn(), l[Ie] = null
                                        }
                                    };

                                    function In(t) {
                                        this._internalRoot = t
                                    }
                                    In.prototype.unstable_scheduleHydration = function(t) {
                                        if (t) {
                                            var l = to();
                                            t = {
                                                blockedOn: null,
                                                target: t,
                                                priority: l
                                            };
                                            for (var e = 0; e < _e.length && l !== 0 && l < _e[e].priority; e++);
                                            _e.splice(e, 0, t), e === 0 && Zd(t)
                                        }
                                    };
                                    var Jd = b.version;
                                    if (Jd !== "19.2.3") throw Error(s(527, Jd, "19.2.3"));
                                    U.findDOMNode = function(t) {
                                        var l = t._reactInternals;
                                        if (l === void 0) throw typeof t.render == "function" ? Error(s(188)) : (t = Object.keys(t).join(","), Error(s(268, t)));
                                        return t = L(l), t = t !== null ? Y(t) : null, t = t === null ? null : t.stateNode, t
                                    };
                                    var ch = {
                                        bundleType: 0,
                                        version: "19.2.3",
                                        rendererPackageName: "react-dom",
                                        currentDispatcherRef: M,
                                        reconcilerVersion: "19.2.3"
                                    };
                                    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
                                        var ti = __REACT_DEVTOOLS_GLOBAL_HOOK__;
                                        if (!ti.isDisabled && ti.supportsFiber) try {
                                            Xa = ti.inject(ch), fl = ti
                                        } catch {}
                                    }
                                    return Ya.createRoot = function(t, l) {
                                        if (!C(t)) throw Error(s(299));
                                        var e = !1,
                                            a = "",
                                            u = Is,
                                            n = tr,
                                            i = lr;
                                        return l != null && (l.unstable_strictMode === !0 && (e = !0), l.identifierPrefix !== void 0 && (a = l.identifierPrefix), l.onUncaughtError !== void 0 && (u = l.onUncaughtError), l.onCaughtError !== void 0 && (n = l.onCaughtError), l.onRecoverableError !== void 0 && (i = l.onRecoverableError)), l = Bd(t, 1, !1, null, null, e, a, null, u, n, i, Kd), t[Ie] = l.current, ff(t), new Mf(l)
                                    }, Ya.hydrateRoot = function(t, l, e) {
                                        if (!C(t)) throw Error(s(299));
                                        var a = !1,
                                            u = "",
                                            n = Is,
                                            i = tr,
                                            c = lr,
                                            o = null;
                                        return e != null && (e.unstable_strictMode === !0 && (a = !0), e.identifierPrefix !== void 0 && (u = e.identifierPrefix), e.onUncaughtError !== void 0 && (n = e.onUncaughtError), e.onCaughtError !== void 0 && (i = e.onCaughtError), e.onRecoverableError !== void 0 && (c = e.onRecoverableError), e.formState !== void 0 && (o = e.formState)), l = Bd(t, 1, !0, l, e ?? null, a, u, o, n, i, c, Kd), l.context = Rd(null), e = l.current, a = vl(), a = vi(a), u = me(a), u.callback = null, ye(e, u, a), e = a, l.current.lanes = e, Za(l, e), ql(l), t[Ie] = l.current, ff(t), new In(l)
                                    }, Ya.version = "19.2.3", Ya
                                }
                                var Yf;

                                function e0() {
                                    if (Yf) return ui.exports;
                                    Yf = 1;

                                    function f() {
                                        if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
                                            __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(f)
                                        } catch (d) {
                                            console.error(d)
                                        }
                                    }
                                    return f(), ui.exports = l0(), ui.exports
                                }
                                var a0 = e0();
                                const u0 = _f(a0),
                                      n0 = {
                                          en: {
                                              title: "Wondher Calc",
                                              placeholder: `Combat Duration: 32m 54s
Battles: 104...`,
                                              hours: "Hours",
                                              days: "Days",
                                              calculate: "Calculate",
                                              currentRates: "Current Rates (Per Hour)",
                                              projections: "Projections",
                                              clickBattleCard: "Click a Battle Card",
                                              openBattleInfo: "Open the Battle Info panel in-game",
                                              updated: "Updated",
                                              waiting: "WAITING",
                                              live: "LIVE",
                                              rates: "Rates",
                                              expand: "Expand",
                                              revenue: "Revenue",
                                              exp: "Exp",
                                              rawCoins: "Coins",
                                              battles: "Battles",
                                              coins: "Coins"
                                          },
                                          pt: {
                                              title: "Wondher Calc",
                                              placeholder: `Combat Duration: 32m 54s
Battles: 104...`,
                                              hours: "Horas",
                                              days: "Dias",
                                              calculate: "Calcular",
                                              currentRates: "Taxas Atuais (Por Hora)",
                                              projections: "Projeções",
                                              clickBattleCard: "Clique em um Battle Card",
                                              openBattleInfo: "Abra o painel de batalha no jogo",
                                              updated: "Atualizado",
                                              waiting: "AGUARDANDO",
                                              live: "AO VIVO",
                                              rates: "Taxas",
                                              expand: "Expandir",
                                              revenue: "Receita",
                                              exp: "Exp",
                                              rawCoins: "Moedas",
                                              battles: "Batalhas",
                                              coins: "Moedas"
                                          }
                                      };

                                function Gf(f) {
                                    if (!f) return 0;
                                    let d = 0;
                                    const b = f.match(/(\d+)d/),
                                          E = f.match(/(\d+)h/),
                                          s = f.match(/(\d+)m/),
                                          C = f.match(/(\d+)s/);
                                    return b && (d += parseInt(b[1]) * 86400), E && (d += parseInt(E[1]) * 3600), s && (d += parseInt(s[1]) * 60), C && (d += parseInt(C[1])), d
                                }

                                function ae(f) {
                                    if (!f) return 0;
                                    let d = f.split("/")[0].trim();
                                    const b = {
                                        k: 1e3,
                                        m: 1e6,
                                        b: 1e9
                                    },
                                          E = d.slice(-1).toLowerCase();
                                    let s = 1;
                                    b[E] && (s = b[E], d = d.slice(0, -1)), d = d.replace(",", ".");
                                    const C = parseFloat(d);
                                    return isNaN(C) ? 0 : C * s
                                }

                                function i0(f) {
                                    const d = {
                                        durationSeconds: 0,
                                        battles: 0,
                                        deaths: 0,
                                        totalRevenue: 0,
                                        totalExp: 0,
                                        rawCoins: 0,
                                        encountersPerHour: 0
                                    },
                                          b = {
                                              combatDuration: /Combat Duration|Duração do combate|Duration/i,
                                              battles: /\bBattles?\b|\bBatalhas?\b/i,
                                              deaths: /\bDeaths?\b|\bMortes?\b/i,
                                              totalRevenue: /Total revenue|Receita total/i,
                                              totalExp: /Total exp|Experiência total|Total EXP/i,
                                              rawCoins: /Raw coins\s*\/\s*hour|Moedas brutas\s*\/\s*hora/i,
                                              encountersPerHour: /Encounters\s*\/\s*hour|Encontros\s*\/\s*hora/i,
                                              revenuePerHour: /Revenue\s*\/\s*hour|Receita\s*\/\s*hora/i,
                                              revenuePerDay: /Revenue\s*\/\s*day|Receita\s*\/\s*dia/i,
                                              totalExpPerHour: /Total exp\s*\/\s*hour|EXP total\s*\/\s*hora/i,
                                              magicExpPerHour: /Magic exp\/hour:?\s*(.+)|EXP de Magia\/hora:?\s*(.+)/i,
                                              staminaExpPerHour: /Stamina exp\/hour:?\s*(.+)|EXP de Stamina\/hora:?\s*(.+)/i,
                                              intelligenceExpPerHour: /Intelligence exp\/hour:?\s*(.+)|EXP de Inteligência\/hora:?\s*(.+)/i,
                                              attackExpPerHour: /Attack exp\/hour:?\s*(.+)|EXP de Ataque\/hora:?\s*(.+)/i,
                                              defenseExpPerHour: /Defense exp\/hour:?\s*(.+)|EXP de Defesa\/hora:?\s*(.+)/i,
                                              strengthExpPerHour: /Strength exp\/hour:?\s*(.+)|EXP de Força\/hora:?\s*(.+)/i,
                                              rangedExpPerHour: /Ranged exp\/hour:?\s*(.+)|EXP de Ranged\/hora:?\s*(.+)/i,
                                              healthExpPerHour: /Health exp\/hour:?\s*(.+)|EXP de Vida\/hora:?\s*(.+)/i
                                          };
                                    for (const [E, s] of Object.entries(b)) {
                                        const C = f.match(s);
                                        if (C) {
                                            const G = C[1].trim();
                                            E === "combatDuration" ? d.durationSeconds = Gf(G) : E === "battles" || E === "deaths" ? d[E] = parseInt(G) : d[E] = ae(G)
                                        }
                                    }
                                    return d
                                }

                                function c0(f) {
                                    if (!f) return console.warn("[Combat Calc] calculateRates called with null stats"), Xf();
                                    let d = {
                                        revenuePerHour: bt(f.revenuePerHour),
                                        rawCoinsPerHour: bt(f.rawCoinsPerHour || f.rawCoins),
                                        expPerHour: bt(f.totalExpPerHour || f.expPerHour),
                                        battlesPerHour: bt(f.encountersPerHour || f.battlesPerHour),
                                        deathsPerHour: 0,
                                        magicExpPerHour: bt(f.magicExpPerHour),
                                        staminaExpPerHour: bt(f.staminaExpPerHour),
                                        intelligenceExpPerHour: bt(f.intelligenceExpPerHour),
                                        attackExpPerHour: bt(f.attackExpPerHour),
                                        defenseExpPerHour: bt(f.defenseExpPerHour),
                                        strengthExpPerHour: bt(f.strengthExpPerHour),
                                        rangedExpPerHour: bt(f.rangedExpPerHour),
                                        characterName: f.characterName || null
                                    };
                                    const E = bt(f.durationSeconds) / 3600;
                                    return E > .01 && (!d.revenuePerHour && f.totalRevenue && (d.revenuePerHour = bt(f.totalRevenue) / E), !d.expPerHour && f.totalExp && (d.expPerHour = bt(f.totalExp) / E), !d.battlesPerHour && f.battles && (d.battlesPerHour = bt(f.battles) / E), f.deaths && (d.deathsPerHour = bt(f.deaths) / E)), d
                                }

                                function f0(f, d) {
                                    const b = f || Xf(),
                                          E = bt(d) || 0,
                                          s = {
                                              revenue: bt(b.revenuePerHour) * E,
                                              rawCoins: bt(b.rawCoinsPerHour) * E,
                                              exp: bt(b.expPerHour) * E,
                                              battles: bt(b.battlesPerHour) * E,
                                              deaths: bt(b.deathsPerHour) * E,
                                              skills: {}
                                          };
                                    return ["magicExpPerHour", "staminaExpPerHour", "intelligenceExpPerHour", "attackExpPerHour", "defenseExpPerHour", "strengthExpPerHour", "rangedExpPerHour"].forEach(G => {
                                        const Z = bt(b[G]);
                                        if (Z > 0) {
                                            const O = G.replace("ExpPerHour", "");
                                            s.skills[O] = Z * E
                                        }
                                    }), s
                                }

                                function Wt(f) {
                                    if (f == null || isNaN(f) || !isFinite(f)) return "0";
                                    const d = Math.abs(f);
                                    return d >= 1e9 ? (f / 1e9).toFixed(2) + "B" : d >= 1e6 ? (f / 1e6).toFixed(2) + "M" : d >= 1e3 ? (f / 1e3).toFixed(1) + "k" : d >= 1 ? Math.floor(f).toLocaleString() : d > 0 ? f.toFixed(2) : "0"
                                }

                                function bt(f) {
                                    if (f == null) return 0;
                                    const d = typeof f == "string" ? parseFloat(f) : f;
                                    return isNaN(d) || !isFinite(d) ? 0 : d
                                }

                                function Xf() {
                                    return {
                                        revenuePerHour: 0,
                                        rawCoinsPerHour: 0,
                                        expPerHour: 0,
                                        battlesPerHour: 0,
                                        deathsPerHour: 0,
                                        magicExpPerHour: 0,
                                        staminaExpPerHour: 0,
                                        intelligenceExpPerHour: 0,
                                        attackExpPerHour: 0,
                                        defenseExpPerHour: 0,
                                        strengthExpPerHour: 0,
                                        rangedExpPerHour: 0,
                                        characterName: null
                                    }
                                }

                                function Qf() {
                                    const f = V => {
                                        const nt = document.getElementById(V);
                                        return nt ? nt.innerText.trim() : null
                                    },
                                          d = document.querySelector(".BattlePanel_battleUnitBattleInfo__3rHcx") || document.querySelector('[class*="BattlePanel_battleUnitBattleInfo"]'),
                                          b = !!d,
                                          E = f("script_battleNumbers"),
                                          s = f("script_totalIncome"),
                                          C = f("script_averageIncome");
                                    f("script_totalIncomeDay");
                                    const G = f("script_avgRawCoinHour"),
                                          Z = f("script_totalSkillsExp"),
                                          O = f("script_averageSkillsExp");
                                    let S = {
                                        encountersPerHour: 0,
                                        revenuePerHour: 0,
                                        rawCoinsPerHour: 0,
                                        totalExpPerHour: 0,
                                        totalRevenue: 0,
                                        totalExp: 0,
                                        battles: 0,
                                        deaths: 0,
                                        durationSeconds: 0,
                                        magicExpPerHour: 0,
                                        staminaExpPerHour: 0,
                                        intelligenceExpPerHour: 0,
                                        attackExpPerHour: 0,
                                        defenseExpPerHour: 0,
                                        strengthExpPerHour: 0,
                                        rangedExpPerHour: 0,
                                        characterName: null,
                                        modalIsOpen: b
                                    };
                                    if (!!(E || C || O)) {
                                        if (E) {
                                            const V = E.match(/:\s*([0-9.,]+)/);
                                            V && (S.encountersPerHour = ae(V[1]))
                                        }
                                        if (C) {
                                            const V = C.match(/:\s*([0-9.,kKmMbB]+)/);
                                            V && (S.revenuePerHour = ae(V[1]))
                                        }
                                        if (G) {
                                            const V = G.match(/:\s*([0-9.,kKmMbB]+)/);
                                            V && (S.rawCoinsPerHour = ae(V[1]))
                                        }
                                        if (O) {
                                            const V = O.match(/:\s*([0-9.,kKmMbB]+)/);
                                            V && (S.totalExpPerHour = ae(V[1]))
                                        }
                                        if (s) {
                                            const V = s.match(/:\s*([0-9.,kKmMbB]+)/);
                                            V && (S.totalRevenue = ae(V[1]))
                                        }
                                        if (Z) {
                                            const V = Z.match(/:\s*([0-9.,kKmMbB]+)/);
                                            V && (S.totalExp = ae(V[1]))
                                        }
                                        if (d) {
                                            const V = d.innerText;
                                            ["Magic", "Stamina", "Intelligence", "Attack", "Defense", "Strength", "Ranged", "Health"].forEach(xt => {
                                                const Vt = new RegExp(`${xt}\\s+exp\\/hour:\\s*([\\d.,kKM]+)`, "i"),
                                                      Ct = V.match(Vt);
                                                Ct && (S[`${xt.toLowerCase()}ExpPerHour`] = ae(Ct[1]))
                                            })
                                        }
                                    }
                                    const Y = document.querySelector(".BattlePanel_combatInfo__sHGCe") || document.querySelector('[class*="BattlePanel_combatInfo"]');
                                    if (Y) {
                                        const V = Y.innerText,
                                              nt = V.match(/Combat Duration:\s*(.+)/i) || V.match(/Duração do combate:\s*(.+)/i);
                                        nt && (S.durationSeconds = Gf(nt[1]));
                                        const xt = V.match(/Battles:\s*(\d+)/i) || V.match(/Batalhas:\s*(\d+)/i);
                                        xt && (S.battles = parseInt(xt[1]));
                                        const Vt = V.match(/Deaths:\s*(\d+)/i) || V.match(/Mortes:\s*(\d+)/i);
                                        Vt && (S.deaths = parseInt(Vt[1]))
                                    }
                                    const R = document.querySelector(".BattlePanel_header__1lU09") || document.querySelector('[class*="BattlePanel_header"]');
                                    if (R) {
                                        const nt = R.innerText.split(" - ");
                                        S.characterName = nt[0].trim()
                                    }
                                    if (S.durationSeconds > 0 && S.battles > 0 && S.encountersPerHour === 0) {
                                        const V = S.durationSeconds / 3600;
                                        S.encountersPerHour = (S.battles - 1) / V
                                    }
                                    return S.encountersPerHour > 0 || S.revenuePerHour > 0 || S.totalExpPerHour > 0 || S.battles > 0 ? S : null
                                }

                                function o0(f) {
                                    let d = 0,
                                        b = null;
                                    const E = 300;
                                    let s = "";
                                    const C = () => {
                                        const Z = Date.now(),
                                              O = () => {
                                                  d = Date.now();
                                                  const S = Qf();
                                                  if (S && (S.encountersPerHour > 0 || S.revenuePerHour > 0 || S.totalExpPerHour > 0)) {
                                                      const L = JSON.stringify(S);
                                                      L !== s && (s = L, f(S))
                                                  }
                                              };
                                        Z - d >= E ? O() : (b && clearTimeout(b), b = setTimeout(() => {
                                            b = null, O()
                                        }, E - (Z - d)))
                                    },
                                          G = new MutationObserver(C);
                                    return G.observe(document.body, {
                                        childList: !0,
                                        subtree: !0,
                                        characterData: !0
                                    }), setTimeout(() => {
                                        const Z = Qf();
                                        Z && (s = JSON.stringify(Z), f(Z))
                                    }, 500), () => {
                                        G.disconnect(), b && clearTimeout(b)
                                    }
                                }
                                const Yl = {};
                                let Zf = !1,
                                    ju = null;

                                function s0() {
                                    if (Zf) {
                                        console.log("[Wondher Calc] WebSocket already hooked");
                                        return
                                    }
                                    try {
                                        const f = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
                                        ju = f.get, f.get = function() {
                                            const b = this.currentTarget;
                                            if (!(b instanceof WebSocket)) return ju.call(this);
                                            if (!(b.url.includes("milkywayidle.com/ws") || b.url.includes("milkywayidlecn.com/ws"))) return ju.call(this);
                                            const s = ju.call(this);
                                            Object.defineProperty(this, "data", {
                                                value: s
                                            });
                                            try {
                                                r0(s)
                                            } catch (C) {
                                                console.error("[Wondher Calc] Error processing WS message:", C)
                                            }
                                            return s
                                        }, Object.defineProperty(MessageEvent.prototype, "data", f), Zf = !0, console.log("[Wondher Calc] WebSocket hook installed successfully")
                                    } catch (f) {
                                        console.error("[Wondher Calc] Failed to hook WebSocket:", f)
                                    }
                                }

                                function r0(f) {
                                    let d;
                                    try {
                                        d = JSON.parse(f)
                                    } catch {
                                        return
                                    }
                                    if (!d || !d.type) return;
                                    const b = d.type;
                                    Yl[b] && Yl[b].forEach(E => {
                                        try {
                                            E(d)
                                        } catch (s) {
                                            console.error("[Wondher Calc] Callback error:", s)
                                        }
                                    }), Yl.raw && Yl.raw.forEach(E => {
                                        try {
                                            E(d)
                                        } catch (s) {
                                            console.error(s)
                                        }
                                    })
                                }

                                function Oe(f, d) {
                                    return Yl[f] || (Yl[f] = []), Yl[f].push(d), () => {
                                        const b = Yl[f].indexOf(d);
                                        b > -1 && Yl[f].splice(b, 1)
                                    }
                                }
                                let D = {
                                    isInCombat: !1,
                                    battleStartTime: null,
                                    battleEndTime: null,
                                    players: [],
                                    monsters: [],
                                    playerStats: {},
                                    inventory: {},
                                    skills: {},
                                    session: {
                                        startTime: Date.now(),
                                        lastUpdate: Date.now(),
                                        totalDamage: 0,
                                        totalHealing: 0,
                                        totalManaUsed: 0,
                                        encountersCompleted: 0,
                                        totalCombatDuration: 0,
                                        loot: {},
                                        xpGained: {},
                                        coinsGained: 0
                                    }
                                },
                                    Cu = {},
                                    Bu = {};
                                const $e = {
                                    onUpdate: [],
                                    onBattleStart: [],
                                    onBattleEnd: []
                                };

                                function d0() {
                                    s0();
                                    const f = M0();
                                    return f && Date.now() - f.lastUpdate < 36e5 ? (D.session = {
                                        ...D.session,
                                        ...f
                                    }, f.playerStats && (D.playerStats = f.playerStats), f.inventory && (D.inventory = f.inventory), f.skills && (D.skills = f.skills)) : Lf(), Oe("init_character_data", m0), Oe("new_battle", y0), Oe("battle_updated", g0), Oe("actions_updated", p0), Oe("items_updated", h0), Oe("battle_consumable_ability_updated", v0), Oe("action_completed", b0), console.log("[Wondher Calc] Combat Tracker initialized (v2.3 WebSocket Edition)"), D
                                }

                                function m0(f) {
                                    f.characterItems && f.characterItems.forEach(d => {
                                        D.inventory[d.itemHrid] = d.count
                                    }), f.characterAbilities && f.characterAbilities.forEach(d => {
                                        D.skills[d.abilityHrid] = d.experience
                                    }), f.characterSkills && f.characterSkills.forEach(d => {
                                        D.skills[d.skillHrid] = d.experience
                                    })
                                }

                                function y0(f) {
                                    D.isInCombat = !0, f.combatStartTime ? D.battleStartTime = Date.parse(f.combatStartTime) : D.battleStartTime = Date.now(), D.battleEndTime = null, D.players = f.players.map((d, b) => ({
                                        name: d.name,
                                        index: b,
                                        maxHP: d.maxHitpoints,
                                        maxMP: d.maxManapoints,
                                        currentHP: d.currentHitpoints,
                                        currentMP: d.currentManapoints,
                                        combatStyle: d.combatDetails?.combatStats?.combatStyleHrids?.[0]?.split("/").pop() || "unknown"
                                    })), D.monsters = f.monsters.map((d, b) => ({
                                        name: d.name,
                                        hrid: d.hrid,
                                        maxHP: d.maxHitpoints,
                                        currentHP: d.currentHitpoints,
                                        index: b
                                    })), D.players.forEach(d => {
                                        D.playerStats[d.name] || (D.playerStats[d.name] = x0(d.name)), D.playerStats[d.name].currentBattle = {
                                            damage: 0,
                                            healing: 0,
                                            manaUsed: 0,
                                            damageByAbility: {},
                                            startTime: Date.now()
                                        }
                                    }), Cu = {}, Bu = {}, f.monsters.forEach((d, b) => Cu[`m${b}`] = d.currentHitpoints), f.players.forEach((d, b) => Bu[`p${b}`] = d.currentManapoints), $e.onBattleStart.forEach(d => d(D)), Fe()
                                }

                                function h0(f) {
                                    f.endCharacterItems && (f.endCharacterItems.forEach(d => {
                                        if (d.itemLocationHrid !== "/item_locations/inventory") return;
                                        const b = d.count,
                                              E = D.inventory[d.itemHrid] || 0;
                                        if (b > E) {
                                            const s = b - E;
                                            d.itemHrid === "/items/coin" ? D.session.coinsGained += s : D.session.loot[d.itemHrid] = (D.session.loot[d.itemHrid] || 0) + s
                                        }
                                        D.inventory[d.itemHrid] = b
                                    }), fi(), Fe())
                                }

                                function v0(f) {
                                    if (f.ability || f.consumable) {
                                        if (f.ability) {
                                            const b = f.ability.abilityHrid,
                                                  E = f.ability.experience,
                                                  s = D.skills[b] || E;
                                            if (E > s) {
                                                const C = E - s;
                                                D.session.xpGained[b] = (D.session.xpGained[b] || 0) + C
                                            }
                                            D.skills[b] = E
                                        }
                                        Fe()
                                    }
                                }

                                function g0(f) {
                                    D.isInCombat || (D.isInCombat = !0);
                                    const d = f.mMap || {},
                                          b = f.pMap || {};
                                    let E = -1;
                                    Object.keys(b).forEach(s => {
                                        const C = b[s].cMP,
                                              G = Bu[`p${s}`] || C;
                                        if (C < G) {
                                            E = parseInt(s);
                                            const Z = G - C,
                                                  O = D.players[s];
                                            O && D.playerStats[O.name] && (D.playerStats[O.name].currentBattle && (D.playerStats[O.name].currentBattle.manaUsed += Z), D.playerStats[O.name].totalManaUsed += Z)
                                        }
                                        Bu[`p${s}`] = C, D.players[s] && (D.players[s].currentHP = b[s].cHP, D.players[s].currentMP = b[s].cMP)
                                    }), Object.keys(d).forEach(s => {
                                        const C = d[s].cHP,
                                              Z = (Cu[`m${s}`] || C) - C;
                                        if (Z > 0) {
                                            const O = D.players.length > 1 && E >= 0 ? E : 0;
                                            if (D.players[O]) {
                                                const S = D.players[O],
                                                      L = D.playerStats[S.name];
                                                if (L) {
                                                    L.currentBattle && (L.currentBattle.damage += Z), L.totalDamage += Z;
                                                    const R = (b[O]?.abilityHrid || (b[O]?.isAutoAtk ? "auto_attack" : "unknown")).split("/").pop();
                                                    L.currentBattle && (L.currentBattle.damageByAbility[R] = (L.currentBattle.damageByAbility[R] || 0) + Z), L.damageByAbility[R] = (L.damageByAbility[R] || 0) + Z
                                                }
                                                D.session.totalDamage += Z
                                            }
                                        }
                                        Cu[`m${s}`] = C, D.monsters[s] && (D.monsters[s].currentHP = d[s].cHP)
                                    }), D.monsters.every(s => s.currentHP <= 0), Fe()
                                }

                                function p0(f) {
                                    (f.endCharacterActions || []).some(E => E.isDone === !0 && E.actionHrid?.startsWith("/actions/combat/")) && D.isInCombat && S0()
                                }

                                function b0(f) {}

                                function S0() {
                                    if (!D.isInCombat) return;
                                    D.isInCombat = !1, D.battleEndTime = Date.now();
                                    const f = D.battleEndTime - D.battleStartTime;
                                    D.session.totalCombatDuration += f, D.session.encountersCompleted += 1, D.players.forEach(d => {
                                        const b = D.playerStats[d.name];
                                        b && b.currentBattle && (b.currentBattle.dps = b.currentBattle.damage / Math.max(1, f / 1e3))
                                    }), fi(), $e.onBattleEnd.forEach(d => d(D)), Fe()
                                }

                                function x0(f) {
                                    return {
                                        name: f,
                                        totalDamage: 0,
                                        totalHealing: 0,
                                        totalManaUsed: 0,
                                        damageByAbility: {},
                                        currentBattle: null
                                    }
                                }

                                function Fe() {
                                    $e.onUpdate.forEach(f => f(D))
                                }

                                function E0(f) {
                                    return $e.onUpdate.push(f), () => $e.onUpdate = $e.onUpdate.filter(d => d !== f)
                                }

                                function z0() {
                                    return D
                                }

                                function Ru() {
                                    let f = 0;
                                    D.isInCombat && D.battleStartTime && (f = Date.now() - D.battleStartTime);
                                    const d = D.session.totalCombatDuration + f,
                                          b = Math.floor(d / 1e3),
                                          E = b / 3600;
                                    return {
                                        ...D.session,
                                        durationSeconds: b,
                                        durationHours: E,
                                        encountersCompleted: D.session.encountersCompleted,
                                        encountersPerHour: E > .01 ? D.session.encountersCompleted / E : 0,
                                        damagePerHour: E > .01 ? D.session.totalDamage / E : 0,
                                        coinsPerHour: E > .01 ? D.session.coinsGained / E : 0,
                                        xpPerHour: {}
                                    }
                                }

                                function T0(f) {
                                    if (!f || f < 0) return "0s";
                                    const d = Math.floor(f / 3600),
                                          b = Math.floor(f % 3600 / 60),
                                          E = Math.floor(f % 60);
                                    return d > 0 ? `${d}h ${b}m` : b > 0 ? `${b}m ${E}s` : `${E}s`
    }

                                function A0(f) {
                                    const d = D.playerStats[f];
                                    if (!d) return 0;
                                    const b = Math.max(1, (D.session.totalCombatDuration + (D.isInCombat ? Date.now() - D.battleStartTime : 0)) / 1e3);
                                    return d.totalDamage / b
                                }

                                function H0(f) {
                                    const d = D.playerStats[f];
                                    if (!d) return {};
                                    const b = d.totalDamage || 1,
                                          E = {};
                                    return Object.entries(d.damageByAbility).forEach(([s, C]) => {
                                        E[s] = {
                                            damage: C,
                                            percentage: C / b * 100
                                        }
                                    }), E
                                }

                                function Lf() {
                                    D.session = {
                                        startTime: Date.now(),
                                        lastUpdate: Date.now(),
                                        totalDamage: 0,
                                        totalHealing: 0,
                                        totalManaUsed: 0,
                                        encountersCompleted: 0,
                                        totalCombatDuration: 0,
                                        coinsGained: 0,
                                        loot: {},
                                        xpGained: {}
                                    }, D.playerStats = {}, fi(), Fe()
                                }

                                function fi() {
                                    D.session.lastUpdate = Date.now();
                                    try {
                                        localStorage.setItem("wondherCalc_session", JSON.stringify({
                                            ...D.session,
                                            playerStats: D.playerStats
                                        }))
                                    } catch {}
                                }

                                function M0() {
                                    try {
                                        return JSON.parse(localStorage.getItem("wondherCalc_session"))
                                    } catch {
                                        return null
                                    }
                                }

                                function _0() {
                                    return {
                                        exported: new Date().toISOString(),
                                        session: Ru(),
                                        loot: D.session.loot,
                                        xp: D.session.xpGained,
                                        players: Object.keys(D.playerStats).map(f => ({
                                            name: f,
                                            ...D.playerStats[f],
                                            dps: A0(f),
                                            abilityBreakdown: H0(f)
                                        }))
                                    }
                                }

                                function D0(f) {
                                    console.log("Ignored scraper update in favor of WebSocket")
                                }

                                function O0({
                                    minimized: f,
                                    toggleMinimize: d,
                                    onClose: b
                                }) {
                                    const [E, s] = gt.useState("pt"), [C, G] = gt.useState(""), [Z, O] = gt.useState(null), [S, L] = gt.useState(24), [Y, R] = gt.useState(0), [St, V] = gt.useState("rates"), [nt, xt] = gt.useState(!0), [Vt, Ct] = gt.useState(null), [pl, Mt] = gt.useState(!1), [Kt, Jt] = gt.useState(null), [Nt, P] = gt.useState(null), [qt, bl] = gt.useState({
                                        width: 380,
                                        height: 560
                                    }), [Ol, wt] = gt.useState(!1), Pt = gt.useRef(null), ue = n0[E];
                                    gt.useEffect(() => {
                                        d0();
                                        const r = E0(T => {
                                            Jt({
                                                ...T
                                            }), P(Ru())
                                        });
                                        return Jt(z0()), P(Ru()), () => r()
                                    }, []);
                                    const il = r => {
                                        r.preventDefault(), r.stopPropagation(), wt(!0)
                                    };
                                    gt.useEffect(() => {
                                        if (!Ol) return;
                                        const r = _ => {
                                            if (!Pt.current) return;
                                            const N = Pt.current.getBoundingClientRect();
                                            bl({
                                                width: Math.max(280, Math.min(600, _.clientX - N.left + 10)),
                                                height: Math.max(380, Math.min(900, _.clientY - N.top + 10))
                                            })
                                        },
                                              T = () => wt(!1);
                                        return document.addEventListener("mousemove", r, !0), document.addEventListener("mouseup", T, !0), () => {
                                            document.removeEventListener("mousemove", r, !0), document.removeEventListener("mouseup", T, !0)
                                        }
                                    }, [Ol]), gt.useEffect(() => {
                                        let r, T;
                                        return nt && !f && (r = o0(_ => {
                                            O(_), Ct(new Date), Mt(!!_.modalIsOpen), (_.durationSeconds || _.battles) && D0({
                                                durationSeconds: _.durationSeconds,
                                                battles: _.battles
                                            })
                                        }), T = setInterval(() => P(Ru()), 2e3)), () => {
                                            r && r(), T && clearInterval(T)
                                        }
                                    }, [nt, f]);
                                    const j = () => {
                                        C && (xt(!1), O(c0(i0(C))))
                                    },
                                          U = (r => r ? {
                                              revenuePerHour: r.revenuePerHour || 0,
                                              rawCoinsPerHour: r.rawCoinsPerHour || r.rawCoins || 0,
                                              expPerHour: r.totalExpPerHour || r.expPerHour || 0,
                                              battlesPerHour: r.encountersPerHour || r.battlesPerHour || 0,
                                              characterName: r.characterName
                                          } : null)(Z),
                                          et = parseFloat(S) + parseFloat(Y) * 24,
                                          mt = U ? f0(U, et) : null;
                                    if (f) return p.jsxs("div", {
                                        style: {
                                            padding: "6px 10px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            background: "rgba(15, 23, 42, 0.85)",
                                            backdropFilter: "blur(12px)",
                                            WebkitBackdropFilter: "blur(12px)",
                                            borderRadius: "8px",
                                            border: "1px solid rgba(168, 85, 247, 0.3)"
                                        },
                                        children: [p.jsx("span", {
                                            style: {
                                                fontWeight: "bold",
                                                fontSize: "0.8rem",
                                                color: "#a855f7"
                                            },
                                            children: "W"
                                        }), Kt?.isInCombat && p.jsx("span", {
                                            style: {
                                                width: "6px",
                                                height: "6px",
                                                borderRadius: "50%",
                                                background: "#ef4444",
                                                animation: "pulse 1s infinite"
                                            }
                                        }), p.jsx("button", {
                                            onClick: d,
                                            style: {
                                                background: "transparent",
                                                border: "none",
                                                cursor: "pointer",
                                                color: "#94a3b8",
                                                padding: "2px",
                                                fontSize: "0.7rem"
                                            },
                                            children: "▶"
                                        })]
                                    });
                                    const kt = [{
                                        id: "rates",
                                        icon: "📊",
                                        label: E === "pt" ? "Taxas" : "Rates"
                                    }, {
                                        id: "dps",
                                        icon: "⚔️",
                                        label: "DPS"
                                    }, {
                                        id: "party",
                                        icon: "👥",
                                        label: E === "pt" ? "Grupo" : "Party"
                                    }, {
                                        id: "loot",
                                        icon: "💰",
                                        label: "Loot"
                                    }, {
                                        id: "xp",
                                        icon: "✨",
                                        label: "XP"
                                    }, {
                                        id: "session",
                                        icon: "📈",
                                        label: E === "pt" ? "Sessão" : "Session"
                                    }];
                                    return p.jsxs("div", {
                                        ref: Pt,
                                        style: {
                                            width: `${qt.width}px`,
                                            height: `${qt.height}px`,
                                            display: "flex",
                                            flexDirection: "column",
                                            background: "rgba(15, 23, 42, 0.75)",
                                            backdropFilter: "blur(16px)",
                                            WebkitBackdropFilter: "blur(16px)",
                                            borderRadius: "12px",
                                            border: "1px solid rgba(168, 85, 247, 0.25)",
                                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                                            overflow: "hidden",
                                            position: "relative",
                                            userSelect: Ol ? "none" : "auto"
                                        },
                                        children: [p.jsxs("div", {
                                            style: {
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "10px 12px",
                                                borderBottom: "1px solid rgba(255,255,255,0.08)",
                                                background: "rgba(30, 41, 59, 0.4)",
                                                flexShrink: 0
                                            },
                                            children: [p.jsxs("div", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    flex: 1,
                                                    minWidth: 0
                                                },
                                                children: [p.jsx("span", {
                                                    style: {
                                                        fontSize: "0.9rem",
                                                        fontWeight: "bold",
                                                        background: "linear-gradient(135deg, #a855f7, #ec4899)",
                                                        WebkitBackgroundClip: "text",
                                                        WebkitTextFillColor: "transparent",
                                                        whiteSpace: "nowrap"
                                                    },
                                                    children: "Wondher"
                                                }), Kt?.isInCombat ? p.jsx("span", {
                                                    style: {
                                                        width: "8px",
                                                        height: "8px",
                                                        borderRadius: "50%",
                                                        background: "#ef4444",
                                                        boxShadow: "0 0 8px #ef4444",
                                                        animation: "pulse 1s infinite"
                                                    },
                                                    title: "Em combate"
                                                }) : nt ? p.jsx("span", {
                                                    style: {
                                                        width: "8px",
                                                        height: "8px",
                                                        borderRadius: "50%",
                                                        background: pl ? "#22c55e" : "#fbbf24",
                                                        boxShadow: pl ? "0 0 8px #22c55e" : "0 0 8px #fbbf24"
                                                    },
                                                    title: pl ? "Live" : "Aguardando"
                                                }) : null]
                                            }), p.jsxs("div", {
                                                style: {
                                                    display: "flex",
                                                    gap: "2px",
                                                    flexShrink: 0
                                                },
                                                children: [p.jsx("button", {
                                                    onClick: () => xt(!nt),
                                                    style: {
                                                        background: "transparent",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontSize: "0.8rem",
                                                        opacity: .6,
                                                        padding: "4px"
                                                    },
                                                    children: nt ? "⏸️" : "▶️"
                                                }), p.jsx("button", {
                                                    onClick: () => s(E === "en" ? "pt" : "en"),
                                                    style: {
                                                        background: "transparent",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontSize: "0.8rem",
                                                        opacity: .6,
                                                        padding: "4px"
                                                    },
                                                    children: E === "en" ? "🇧🇷" : "🇺🇸"
                                                }), p.jsx("button", {
                                                    onClick: d,
                                                    style: {
                                                        background: "transparent",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        color: "white",
                                                        opacity: .6,
                                                        padding: "4px",
                                                        fontSize: "0.8rem"
                                                    },
                                                    children: "➖"
                                                }), p.jsx("button", {
                                                    onClick: b,
                                                    style: {
                                                        background: "transparent",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        color: "#f87171",
                                                        opacity: .7,
                                                        padding: "4px",
                                                        fontSize: "0.8rem"
                                                    },
                                                    children: "✕"
                                                })]
                                            })]
                                        }), p.jsx("div", {
                                            style: {
                                                display: "flex",
                                                borderBottom: "1px solid rgba(255,255,255,0.08)",
                                                background: "rgba(30, 41, 59, 0.2)",
                                                flexShrink: 0
                                            },
                                            children: kt.map(r => p.jsxs("button", {
                                                onClick: () => V(r.id),
                                                style: {
                                                    flex: 1,
                                                    padding: "8px 4px",
                                                    background: St === r.id ? "rgba(168, 85, 247, 0.15)" : "transparent",
                                                    border: "none",
                                                    color: St === r.id ? "#a855f7" : "#64748b",
                                                    borderBottom: St === r.id ? "2px solid #a855f7" : "2px solid transparent",
                                                    cursor: "pointer",
                                                    fontWeight: St === r.id ? "600" : "400",
                                                    fontSize: "0.7rem",
                                                    transition: "all 0.2s"
                                                },
                                                children: [r.icon, p.jsx("span", {
                                                    style: {
                                                        marginLeft: "3px"
                                                    },
                                                    children: r.label
                                                })]
                                            }, r.id))
                                        }), p.jsxs("div", {
                                            style: {
                                                flex: 1,
                                                overflow: "auto",
                                                padding: "10px",
                                                paddingBottom: "28px"
                                            },
                                            children: [St === "rates" && p.jsx(U0, {
                                                rates: U,
                                                projections: mt,
                                                targetHours: S,
                                                targetDays: Y,
                                                totalTargetHours: et,
                                                setTargetHours: L,
                                                setTargetDays: R,
                                                isLive: nt,
                                                input: C,
                                                setInput: G,
                                                handleCalculate: j,
                                                t: ue
                                            }), St === "dps" && p.jsx(j0, {
                                                combatState: Kt,
                                                lang: E
                                            }), St === "party" && p.jsx(C0, {
                                                combatState: Kt,
                                                lang: E
                                            }), St === "loot" && p.jsx(B0, {
                                                sessionStats: Nt,
                                                lang: E
                                            }), St === "xp" && p.jsx(R0, {
                                                sessionStats: Nt,
                                                lang: E
                                            }), St === "session" && p.jsx(N0, {
                                                sessionStats: Nt,
                                                lang: E
                                            })]
                                        }), p.jsx("div", {
                                            onMouseDown: il,
                                            style: {
                                                position: "absolute",
                                                bottom: 0,
                                                right: 0,
                                                width: "14px",
                                                height: "14px",
                                                cursor: "se-resize",
                                                zIndex: 100
                                            },
                                            children: p.jsx("svg", {
                                                width: "14",
                                                height: "14",
                                                viewBox: "0 0 14 14",
                                                style: {
                                                    opacity: .3
                                                },
                                                children: p.jsx("path", {
                                                    d: "M12 12L5 12L12 5L12 12Z",
                                                    fill: "#a855f7"
                                                })
                                            })
                                        }), Vt && nt && p.jsx("div", {
                                            style: {
                                                position: "absolute",
                                                bottom: "4px",
                                                left: "8px",
                                                fontSize: "0.5rem",
                                                color: "#475569"
                                            },
                                            children: Vt.toLocaleTimeString()
                                        })]
                                    })
                                }

                                function U0({
                                    rates: f,
                                    projections: d,
                                    targetHours: b,
                                    targetDays: E,
                                    totalTargetHours: s,
                                    setTargetHours: C,
                                    setTargetDays: G,
                                    isLive: Z,
                                    input: O,
                                    setInput: S,
                                    handleCalculate: L,
                                    t: Y
                                }) {
                                    return !f && Z ? p.jsx(Pe, {
                                        icon: "👆",
                                        title: Y.clickBattleCard,
                                        subtitle: Y.openBattleInfo
                                    }) : f ? p.jsxs(p.Fragment, {
                                        children: [p.jsxs("section", {
                                            style: {
                                                marginBottom: "12px"
                                            },
                                            children: [p.jsx("h4", {
                                                style: {
                                                    marginBottom: "6px",
                                                    fontSize: "0.65rem",
                                                    color: "#64748b",
                                                    textTransform: "uppercase"
                                                },
                                                children: Y.currentRates
                                            }), p.jsxs("div", {
                                                style: {
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(2, 1fr)",
                                                    gap: "6px"
                                                },
                                                children: [p.jsx(gl, {
                                                    label: Y.revenue,
                                                    value: Wt(f.revenuePerHour),
                                                    color: "#22c55e"
                                                }), p.jsx(gl, {
                                                    label: Y.exp,
                                                    value: Wt(f.expPerHour),
                                                    color: "#3b82f6"
                                                }), p.jsx(gl, {
                                                    label: Y.rawCoins,
                                                    value: Wt(f.rawCoinsPerHour),
                                                    color: "#eab308"
                                                }), p.jsx(gl, {
                                                    label: Y.battles + "/h",
                                                    value: Wt(f.battlesPerHour),
                                                    color: "#ec4899"
                                                })]
                                            })]
                                        }), p.jsxs("section", {
                                            children: [p.jsxs("div", {
                                                style: {
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    marginBottom: "6px"
                                                },
                                                children: [p.jsx("h4", {
                                                    style: {
                                                        fontSize: "0.65rem",
                                                        color: "#64748b",
                                                        margin: 0,
                                                        textTransform: "uppercase"
                                                    },
                                                    children: Y.projections
                                                }), p.jsxs("span", {
                                                    style: {
                                                        fontSize: "0.7rem",
                                                        color: "#a855f7",
                                                        fontWeight: "600"
                                                    },
                                                    children: [s.toFixed(0), "h"]
                                                })]
                                            }), p.jsxs("div", {
                                                style: {
                                                    marginBottom: "8px",
                                                    padding: "8px",
                                                    background: "rgba(30, 41, 59, 0.4)",
                                                    borderRadius: "6px"
                                                },
                                                children: [p.jsxs("div", {
                                                    style: {
                                                        marginBottom: "6px"
                                                    },
                                                    children: [p.jsxs("div", {
                                                        style: {
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            fontSize: "0.6rem",
                                                            color: "#94a3b8",
                                                            marginBottom: "2px"
                                                        },
                                                        children: [p.jsx("span", {
                                                            children: Y.hours
                                                        }), p.jsx("span", {
                                                            children: b
                                                        })]
                                                    }), p.jsx("input", {
                                                        type: "range",
                                                        min: "0",
                                                        max: "23",
                                                        value: b,
                                                        onChange: R => C(parseInt(R.target.value)),
                                                        style: {
                                                            width: "100%",
                                                            height: "3px",
                                                            accentColor: "#a855f7"
                                                        }
                                                    })]
                                                }), p.jsxs("div", {
                                                    children: [p.jsxs("div", {
                                                        style: {
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            fontSize: "0.6rem",
                                                            color: "#94a3b8",
                                                            marginBottom: "2px"
                                                        },
                                                        children: [p.jsx("span", {
                                                            children: Y.days
                                                        }), p.jsx("span", {
                                                            children: E
                                                        })]
                                                    }), p.jsx("input", {
                                                        type: "range",
                                                        min: "0",
                                                        max: "30",
                                                        value: E,
                                                        onChange: R => G(parseInt(R.target.value)),
                                                        style: {
                                                            width: "100%",
                                                            height: "3px",
                                                            accentColor: "#a855f7"
                                                        }
                                                    })]
                                                })]
                                            }), d && p.jsxs("div", {
                                                style: {
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(2, 1fr)",
                                                    gap: "6px"
                                                },
                                                children: [p.jsx(gl, {
                                                    label: Y.revenue,
                                                    value: Wt(d.revenue),
                                                    color: "#a855f7"
                                                }), p.jsx(gl, {
                                                    label: Y.exp,
                                                    value: Wt(d.exp),
                                                    color: "#a855f7"
                                                }), p.jsx(gl, {
                                                    label: Y.coins,
                                                    value: Wt(d.rawCoins),
                                                    color: "#a855f7"
                                                }), p.jsx(gl, {
                                                    label: Y.battles,
                                                    value: Wt(d.battles),
                                                    color: "#a855f7"
                                                })]
                                            })]
                                        })]
                                    }) : p.jsxs("div", {
                                        style: {
                                            display: "flex",
                                            gap: "6px",
                                            marginBottom: "10px"
                                        },
                                        children: [p.jsx("textarea", {
                                            value: O,
                                            onChange: R => S(R.target.value),
                                            placeholder: Y.placeholder,
                                            style: {
                                                flex: 1,
                                                resize: "none",
                                                fontSize: "0.7rem",
                                                padding: "6px",
                                                borderRadius: "6px",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                background: "rgba(30, 41, 59, 0.5)",
                                                color: "#e2e8f0"
                                            },
                                            rows: "3"
                                        }), p.jsx("button", {
                                            onClick: L,
                                            style: {
                                                padding: "0 12px",
                                                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                                                border: "none",
                                                borderRadius: "6px",
                                                color: "white",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                fontSize: "0.75rem"
                                            },
                                            children: "Go"
                                        })]
                                    })
                                }

                                function j0({
                                    combatState: f,
                                    lang: d
                                }) {
                                    if (!f || Object.keys(f.playerStats || {}).length === 0) return p.jsx(Pe, {
                                        icon: "⚔️",
                                        title: d === "pt" ? "Aguardando Combate" : "Waiting for Combat",
                                        subtitle: d === "pt" ? "Entre em combate para ver o DPS" : "Enter combat to see DPS"
                                    });
                                    const b = Object.entries(f.playerStats).map(([s, C]) => ({
                                        name: s,
                                        ...C,
                                        dps: C.totalDamage / Math.max(1, f.session?.combatDurationSeconds || 1)
                                    })).sort((s, C) => C.totalDamage - s.totalDamage),
                                          E = Math.max(...b.map(s => s.totalDamage), 1);
                                    return p.jsxs("div", {
                                        children: [p.jsx("h4", {
                                            style: {
                                                marginBottom: "10px",
                                                fontSize: "0.65rem",
                                                color: "#64748b",
                                                textTransform: "uppercase"
                                            },
                                            children: d === "pt" ? "Dano por Jogador" : "Damage by Player"
                                        }), b.map((s, C) => p.jsxs("div", {
                                            style: {
                                                marginBottom: "10px"
                                            },
                                            children: [p.jsxs("div", {
                                                style: {
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    marginBottom: "3px"
                                                },
                                                children: [p.jsxs("span", {
                                                    style: {
                                                        fontSize: "0.75rem",
                                                        fontWeight: "600",
                                                        color: "#e2e8f0"
                                                    },
                                                    children: [C === 0 ? "👑 " : "", s.name]
                                                }), p.jsxs("span", {
                                                    style: {
                                                        fontSize: "0.7rem",
                                                        color: "#a855f7",
                                                        fontWeight: "600"
                                                    },
                                                    children: [Wt(s.dps), " DPS"]
                                                })]
                                            }), p.jsxs("div", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px"
                                                },
                                                children: [p.jsx("div", {
                                                    style: {
                                                        flex: 1,
                                                        height: "6px",
                                                        background: "rgba(30, 41, 59, 0.5)",
                                                        borderRadius: "3px",
                                                        overflow: "hidden"
                                                    },
                                                    children: p.jsx("div", {
                                                        style: {
                                                            width: `${s.totalDamage / E * 100}%`,
                                                            height: "100%",
                                                            background: C === 0 ? "linear-gradient(90deg, #a855f7, #ec4899)" : "#6366f1",
                                                            borderRadius: "3px"
                                                        }
                                                    })
                                                }), p.jsx("span", {
                                                    style: {
                                                        fontSize: "0.65rem",
                                                        color: "#94a3b8",
                                                        minWidth: "45px",
                                                        textAlign: "right"
                                                    },
                                                    children: Wt(s.totalDamage)
                                                })]
                                            }), s.damageByAbility && Object.keys(s.damageByAbility).length > 0 && p.jsx("div", {
                                                style: {
                                                    marginTop: "4px",
                                                    paddingLeft: "6px"
                                                },
                                                children: Object.entries(s.damageByAbility).sort((G, Z) => Z[1] - G[1]).slice(0, 3).map(([G, Z]) => p.jsxs("div", {
                                                    style: {
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        fontSize: "0.6rem",
                                                        color: "#64748b"
                                                    },
                                                    children: [p.jsx("span", {
                                                        style: {
                                                            textTransform: "capitalize"
                                                        },
                                                        children: G.replace(/_/g, " ")
                                                    }), p.jsxs("span", {
                                                        children: [(Z / s.totalDamage * 100).toFixed(0), "%"]
                                                    })]
                                                }, G))
                                            })]
                                        }, s.name))]
                                    })
                                }

                                function C0({
                                    combatState: f,
                                    lang: d
                                }) {
                                    return !f?.players || f.players.length === 0 ? p.jsx(Pe, {
                                        icon: "👥",
                                        title: d === "pt" ? "Aguardando Grupo" : "Waiting for Party",
                                        subtitle: d === "pt" ? "Entre em combate para ver o grupo" : "Enter combat to see party"
                                    }) : p.jsxs("div", {
                                        children: [p.jsxs("h4", {
                                            style: {
                                                marginBottom: "10px",
                                                fontSize: "0.65rem",
                                                color: "#64748b",
                                                textTransform: "uppercase"
                                            },
                                            children: [d === "pt" ? "Membros" : "Members", " (", f.players.length, ")"]
                                        }), f.players.map(b => {
                                            const E = b.currentHP / b.maxHP * 100,
                                                  s = b.currentMP / b.maxMP * 100;
                                            return p.jsxs("div", {
                                                style: {
                                                    marginBottom: "8px",
                                                    padding: "8px",
                                                    background: "rgba(30, 41, 59, 0.4)",
                                                    borderRadius: "6px"
                                                },
                                                children: [p.jsxs("div", {
                                                    style: {
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginBottom: "6px"
                                                    },
                                                    children: [p.jsx("span", {
                                                        style: {
                                                            fontSize: "0.8rem",
                                                            fontWeight: "600",
                                                            color: "#e2e8f0"
                                                        },
                                                        children: b.name
                                                    }), p.jsx("span", {
                                                        style: {
                                                            fontSize: "0.6rem",
                                                            color: "#94a3b8",
                                                            textTransform: "capitalize"
                                                        },
                                                        children: b.combatStyle
                                                    })]
                                                }), p.jsxs("div", {
                                                    style: {
                                                        marginBottom: "4px"
                                                    },
                                                    children: [p.jsxs("div", {
                                                        style: {
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            fontSize: "0.55rem",
                                                            color: "#94a3b8",
                                                            marginBottom: "1px"
                                                        },
                                                        children: [p.jsx("span", {
                                                            children: "HP"
                                                        }), p.jsxs("span", {
                                                            children: [b.currentHP, "/", b.maxHP]
                                                        })]
                                                    }), p.jsx("div", {
                                                        style: {
                                                            height: "5px",
                                                            background: "rgba(0,0,0,0.3)",
                                                            borderRadius: "2px",
                                                            overflow: "hidden"
                                                        },
                                                        children: p.jsx("div", {
                                                            style: {
                                                                width: `${E}%`,
                                                                height: "100%",
                                                                background: E > 50 ? "#22c55e" : E > 25 ? "#eab308" : "#ef4444"
                                                            }
                                                        })
                                                    })]
                                                }), p.jsxs("div", {
                                                    children: [p.jsxs("div", {
                                                        style: {
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            fontSize: "0.55rem",
                                                            color: "#94a3b8",
                                                            marginBottom: "1px"
                                                        },
                                                        children: [p.jsx("span", {
                                                            children: "MP"
                                                        }), p.jsxs("span", {
                                                            children: [b.currentMP, "/", b.maxMP]
                                                        })]
                                                    }), p.jsx("div", {
                                                        style: {
                                                            height: "5px",
                                                            background: "rgba(0,0,0,0.3)",
                                                            borderRadius: "2px",
                                                            overflow: "hidden"
                                                        },
                                                        children: p.jsx("div", {
                                                            style: {
                                                                width: `${s}%`,
                                                                height: "100%",
                                                                background: "#3b82f6"
                                                            }
                                                        })
                                                    })]
                                                })]
                                            }, b.name)
                                        }), f.monsters?.length > 0 && p.jsxs(p.Fragment, {
                                            children: [p.jsx("h4", {
                                                style: {
                                                    marginTop: "12px",
                                                    marginBottom: "6px",
                                                    fontSize: "0.65rem",
                                                    color: "#64748b",
                                                    textTransform: "uppercase"
                                                },
                                                children: d === "pt" ? "Monstros" : "Monsters"
                                            }), p.jsx("div", {
                                                style: {
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: "4px"
                                                },
                                                children: f.monsters.map((b, E) => p.jsx("span", {
                                                    style: {
                                                        padding: "3px 6px",
                                                        background: "rgba(239, 68, 68, 0.1)",
                                                        borderRadius: "4px",
                                                        fontSize: "0.65rem",
                                                        color: "#f87171"
                                                    },
                                                    children: b.name
                                                }, E))
                                            })]
                                        })]
                                    })
                                }

                                function B0({
                                    sessionStats: f,
                                    lang: d
                                }) {
                                    if (!f || Object.keys(f.loot || {}).length === 0 && !f.coinsGained) return p.jsx(Pe, {
                                        icon: "💰",
                                        title: d === "pt" ? "Nenhum Loot" : "No Loot",
                                        subtitle: d === "pt" ? "Itens cairão aqui" : "Items will drop here"
                                    });
                                    const b = Object.entries(f.loot || {}).sort((E, s) => s[1] - E[1]);
                                    return p.jsxs("div", {
                                        children: [p.jsx("h4", {
                                            style: {
                                                marginBottom: "10px",
                                                fontSize: "0.65rem",
                                                color: "#64748b",
                                                textTransform: "uppercase"
                                            },
                                            children: d === "pt" ? "Recursos Obtidos" : "Loot Collected"
                                        }), f.coinsGained > 0 && p.jsxs("div", {
                                            style: {
                                                marginBottom: "8px",
                                                padding: "8px",
                                                background: "rgba(234, 179, 8, 0.15)",
                                                borderRadius: "6px",
                                                border: "1px solid rgba(234, 179, 8, 0.3)",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            },
                                            children: [p.jsx("span", {
                                                style: {
                                                    fontSize: "0.8rem",
                                                    color: "#facc15",
                                                    fontWeight: "bold"
                                                },
                                                children: "🪙 Coins"
                                            }), p.jsx("span", {
                                                style: {
                                                    fontSize: "0.9rem",
                                                    color: "#facc15",
                                                    fontWeight: "bold"
                                                },
                                                children: Wt(f.coinsGained)
                                            })]
                                        }), p.jsx("div", {
                                            style: {
                                                display: "grid",
                                                gridTemplateColumns: "repeat(2, 1fr)",
                                                gap: "6px"
                                            },
                                            children: b.map(([E, s]) => p.jsxs("div", {
                                                style: {
                                                    padding: "6px 8px",
                                                    background: "rgba(30, 41, 59, 0.4)",
                                                    borderRadius: "5px",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                },
                                                children: [p.jsx("span", {
                                                    style: {
                                                        fontSize: "0.65rem",
                                                        color: "#cbd5e1",
                                                        textTransform: "capitalize",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        maxWidth: "70%"
                                                    },
                                                    title: E.split("/").pop().replace(/_/g, " "),
                                                    children: E.split("/").pop().replace(/_/g, " ")
                                                }), p.jsx("span", {
                                                    style: {
                                                        fontSize: "0.75rem",
                                                        fontWeight: "600",
                                                        color: "#a855f7"
                                                    },
                                                    children: Wt(s)
                                                })]
                                            }, E))
                                        }), b.length === 0 && !f.coinsGained && p.jsx("div", {
                                            style: {
                                                textAlign: "center",
                                                fontSize: "0.7rem",
                                                color: "#64748b",
                                                padding: "20px"
                                            },
                                            children: "Waiting for drops..."
                                        })]
                                    })
                                }

                                function R0({
                                    sessionStats: f,
                                    lang: d
                                }) {
                                    if (!f || Object.keys(f.xpGained || {}).length === 0) return p.jsx(Pe, {
                                        icon: "✨",
                                        title: d === "pt" ? "Nenhum XP" : "No XP",
                                        subtitle: d === "pt" ? "XP de skills aparecerá aqui" : "Skill XP will appear here"
                                    });
                                    const b = Object.entries(f.xpGained || {}).sort((s, C) => C[1] - s[1]),
                                          E = f.durationHours || 1;
                                    return p.jsxs("div", {
                                        children: [p.jsx("h4", {
                                            style: {
                                                marginBottom: "10px",
                                                fontSize: "0.65rem",
                                                color: "#64748b",
                                                textTransform: "uppercase"
                                            },
                                            children: d === "pt" ? "Ganhos de XP" : "XP Gains"
                                        }), p.jsx("div", {
                                            style: {
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "6px"
                                            },
                                            children: b.map(([s, C]) => p.jsxs("div", {
                                                style: {
                                                    padding: "8px",
                                                    background: "rgba(30, 41, 59, 0.4)",
                                                    borderRadius: "6px"
                                                },
                                                children: [p.jsxs("div", {
                                                    style: {
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginBottom: "2px"
                                                    },
                                                    children: [p.jsx("span", {
                                                        style: {
                                                            fontSize: "0.75rem",
                                                            fontWeight: "600",
                                                            color: "#e2e8f0",
                                                            textTransform: "capitalize"
                                                        },
                                                        children: s.split("/").pop().replace(/_/g, " ")
                                                    }), p.jsxs("span", {
                                                        style: {
                                                            fontSize: "0.75rem",
                                                            fontWeight: "600",
                                                            color: "#3b82f6"
                                                        },
                                                        children: [Wt(C), " XP"]
                                                    })]
                                                }), p.jsxs("div", {
                                                    style: {
                                                        fontSize: "0.6rem",
                                                        color: "#64748b",
                                                        textAlign: "right"
                                                    },
                                                    children: [Wt(C / Math.max(.001, E)), " XP/h"]
                                                })]
                                            }, s))
                                        })]
                                    })
                                }

                                function N0({
                                    sessionStats: f,
                                    lang: d
                                }) {
                                    const b = () => {
                                        const s = _0(),
                                              C = new Blob([JSON.stringify(s, null, 2)], {
                                                  type: "application/json"
                                              }),
                                              G = document.createElement("a");
                                        G.href = URL.createObjectURL(C), G.download = `wondher-session-${new Date().toISOString().split("T")[0]}.json`, G.click()
                                    },
                                          E = () => {
                                              confirm(d === "pt" ? "Resetar sessão?" : "Reset session?") && Lf()
                                          };
                                    return !f || f.encountersCompleted === 0 && f.totalDamage === 0 && f.durationSeconds === 0 ? p.jsx(Pe, {
                                        icon: "📈",
                                        title: d === "pt" ? "Nenhuma Sessão" : "No Session",
                                        subtitle: d === "pt" ? "Abra um Battle Card para ver os dados" : "Open a Battle Card to see data"
                                    }) : p.jsxs("div", {
                                        children: [p.jsxs("div", {
                                            style: {
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: "10px"
                                            },
                                            children: [p.jsx("h4", {
                                                style: {
                                                    fontSize: "0.65rem",
                                                    color: "#64748b",
                                                    textTransform: "uppercase",
                                                    margin: 0
                                                },
                                                children: d === "pt" ? "Sessão" : "Session"
                                            }), p.jsxs("div", {
                                                style: {
                                                    display: "flex",
                                                    gap: "4px"
                                                },
                                                children: [p.jsx("button", {
                                                    onClick: b,
                                                    style: {
                                                        fontSize: "0.55rem",
                                                        padding: "3px 6px",
                                                        background: "rgba(34, 197, 94, 0.15)",
                                                        border: "1px solid rgba(34, 197, 94, 0.3)",
                                                        borderRadius: "4px",
                                                        color: "#4ade80",
                                                        cursor: "pointer"
                                                    },
                                                    children: "📥"
                                                }), p.jsx("button", {
                                                    onClick: E,
                                                    style: {
                                                        fontSize: "0.55rem",
                                                        padding: "3px 6px",
                                                        background: "rgba(239, 68, 68, 0.15)",
                                                        border: "1px solid rgba(239, 68, 68, 0.3)",
                                                        borderRadius: "4px",
                                                        color: "#f87171",
                                                        cursor: "pointer"
                                                    },
                                                    children: "🔄"
                                                })]
                                            })]
                                        }), p.jsxs("div", {
                                            style: {
                                                display: "grid",
                                                gridTemplateColumns: "repeat(2, 1fr)",
                                                gap: "6px"
                                            },
                                            children: [p.jsx(gl, {
                                                label: d === "pt" ? "Duração" : "Duration",
                                                value: T0(f.durationSeconds),
                                                color: "#a855f7"
                                            }), p.jsx(gl, {
                                                label: d === "pt" ? "Batalhas" : "Battles",
                                                value: f.encountersCompleted || 0,
                                                color: "#ec4899"
                                            }), p.jsx(gl, {
                                                label: d === "pt" ? "Dano Total" : "Total Damage",
                                                value: Wt(f.totalDamage || 0),
                                                color: "#f87171"
                                            }), p.jsx(gl, {
                                                label: d === "pt" ? "Batalhas/h" : "Battles/h",
                                                value: (f.encountersPerHour || 0).toFixed(1),
                                                color: "#22c55e"
                                            })]
                                        }), f.xpGained && Object.keys(f.xpGained).length > 0 && p.jsx("div", {
                                            style: {
                                                marginTop: "10px",
                                                opacity: .6
                                            },
                                            children: p.jsx("div", {
                                                style: {
                                                    fontSize: "0.6rem",
                                                    color: "#64748b",
                                                    textAlign: "center"
                                                },
                                                children: d === "pt" ? "Veja a aba XP para detalhes" : "See XP tab for details"
                                            })
                                        })]
                                    })
                                }

                                function Pe({
                                    icon: f,
                                    title: d,
                                    subtitle: b
                                }) {
                                    return p.jsxs("div", {
                                        style: {
                                            textAlign: "center",
                                            padding: "20px 12px",
                                            color: "#64748b",
                                            fontSize: "0.8rem",
                                            background: "rgba(30, 41, 59, 0.3)",
                                            borderRadius: "8px",
                                            border: "1px dashed rgba(100, 116, 139, 0.2)"
                                        },
                                        children: [p.jsx("div", {
                                            style: {
                                                fontSize: "1.8rem",
                                                marginBottom: "6px"
                                            },
                                            children: f
                                        }), p.jsx("div", {
                                            style: {
                                                fontWeight: "500",
                                                color: "#94a3b8",
                                                marginBottom: "3px"
                                            },
                                            children: d
                                        }), p.jsx("div", {
                                            style: {
                                                fontSize: "0.7rem"
                                            },
                                            children: b
                                        })]
                                    })
                                }

                                function gl({
                                    label: f,
                                    value: d,
                                    color: b
                                }) {
                                    return p.jsxs("div", {
                                        style: {
                                            padding: "6px 8px",
                                            background: "rgba(30, 41, 59, 0.4)",
                                            borderRadius: "6px"
                                        },
                                        children: [p.jsx("div", {
                                            style: {
                                                fontSize: "0.55rem",
                                                color: "#64748b",
                                                marginBottom: "1px"
                                            },
                                            children: f
                                        }), p.jsx("div", {
                                            style: {
                                                fontSize: "0.9rem",
                                                fontWeight: "700",
                                                color: b
                                            },
                                            children: d
                                        })]
                                    })
                                }

                                function q0() {
                                    const [f, d] = gt.useState(!0), [b, E] = gt.useState(!1), [s, C] = gt.useState({
                                        x: 20,
                                        y: 20
                                    }), G = gt.useRef(!1), Z = gt.useRef({
                                        x: 0,
                                        y: 0
                                    }), O = Y => {
                                        Y.target.tagName === "INPUT" || Y.target.tagName === "TEXTAREA" || Y.target.tagName === "BUTTON" || (G.current = !0, Z.current = {
                                            x: Y.clientX - s.x,
                                            y: Y.clientY - s.y
                                        })
                                    }, S = Y => {
                                        G.current && C({
                                            x: Y.clientX - Z.current.x,
                                            y: Y.clientY - Z.current.y
                                        })
                                    }, L = () => {
                                        G.current = !1
                                    };
                                    return gt.useEffect(() => (window.addEventListener("mousemove", S), window.addEventListener("mouseup", L), () => {
                                        window.removeEventListener("mousemove", S), window.removeEventListener("mouseup", L)
                                    }), []), f ? p.jsx("div", {
                                        style: {
                                            position: "fixed",
                                            top: s.y,
                                            left: s.x,
                                            zIndex: 9999,
                                            background: "rgba(9, 9, 11, 0.95)",
                                            backdropFilter: "blur(10px)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "16px",
                                            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                                            width: "auto",
                                            color: "white",
                                            cursor: G.current ? "grabbing" : "grab",
                                            fontFamily: "'Inter', sans-serif"
                                        },
                                        onMouseDown: O,
                                        children: p.jsx(O0, {
                                            minimized: b,
                                            toggleMinimize: () => E(!b),
                                            onClose: () => d(!1)
                                        })
                                    }) : p.jsx("button", {
                                        style: {
                                            position: "fixed",
                                            bottom: 20,
                                            right: 20,
                                            zIndex: 9999,
                                            padding: "10px",
                                            background: "#6366f1",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                                        },
                                        onClick: () => d(!0),
                                        children: "⚔️"
                                    })
                                }
                                const Y0 = `
:host {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  color: #f8fafc;
}

/* Reset for shadow DOM content */
* {
  box-sizing: border-box;
}

button {
  cursor: pointer;
  border: none;
  font-family: inherit;
}

h1, h2, h3, h4 {
  margin: 0;
  font-weight: 700;
}

.glass-card {
  background: rgba(25, 25, 35, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.input-area {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #f8fafc;
  padding: 0.5rem;
  font-family: monospace;
  font-size: 0.9rem;
  outline: none;
  resize: vertical;
  min-height: 80px;
}

.input-area:focus {
  border-color: #6366f1;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat-label {
  color: #94a3b8;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.slider-container {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 0.5rem;
}

input[type="range"] {
  width: 100%;
  accent-color: #8b5cf6;
}
`,
                                      Vf = "mwi-combat-calc-root";

                                function G0() {
                                    if (document.getElementById(Vf)) return;
                                    const f = document.createElement("div");
                                    f.id = Vf, Object.assign(f.style, {
                                        position: "fixed",
                                        top: "0",
                                        left: "0",
                                        width: "0",
                                        height: "0",
                                        zIndex: "999999"
                                    }), document.body.appendChild(f);
                                    const d = f.attachShadow({
                                        mode: "open"
                                    }),
                                          b = document.createElement("style");
                                    b.textContent = Y0, d.appendChild(b);
                                    const E = document.createElement("div");
                                    d.appendChild(E), u0.createRoot(E).render(p.jsx($d.StrictMode, {
                                        children: p.jsx(q0, {})
                                    }))
                                }
                                G0()
                            })();
                        })();