// ==UserScript==
// @name         LIMS DRAGEN SampleSheet 생성기
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  DRAGEN SampleSheet 생성기 (Lane Priority Group Sort)
// @author       김재형
// @match        https://lims3.macrogen.com/ngs/amplification/retrieveNgsAmplificationHiSeqWorkForm.do?menuCd=NGS150400
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558585/LIMS%20DRAGEN%20SampleSheet%20%EC%83%9D%EC%84%B1%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/558585/LIMS%20DRAGEN%20SampleSheet%20%EC%83%9D%EC%84%B1%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const INDEX_MAP = {
    "UDP-A70V3": {
      "i1": "TTACTCCACA",
      "i2": "GACACCGATG"
    },
    "UDP-A03V3": {
      "i1": "CGACATCCGA",
      "i2": "TACGTTCATT"
    },
    "UDP-A05V3": {
      "i1": "CACAATAGGA",
      "i2": "TCCATCCGAG"
    },
    "UDP-A46V3": {
      "i1": "GCAACATGGA",
      "i2": "CTTGTCTTAA"
    },
    "UDP-A69V3": {
      "i1": "CCAAGGCCTT",
      "i2": "TCGAAGTACT"
    },
    "UDP-A84V3": {
      "i1": "ACTGGATCTA",
      "i2": "TCGCCGCTAG"
    },
    "UDP-A72V3": {
      "i1": "TACGAGTCCA",
      "i2": "TAGCGAAGCA"
    },
    "UDP-A71V3": {
      "i1": "AGTAGAAGTG",
      "i2": "CTAGCGTCGA"
    },
    "UDP-A01": {
      "i1": "GAACTGAGCG",
      "i2": "TCGTGGAGCG"
    },
    "UDP-A02": {
      "i1": "AGGTCAGATA",
      "i2": "CTACAAGATA"
    },
    "UDP-A03": {
      "i1": "CGTCTCATAT",
      "i2": "TATAGTAGCT"
    },
    "UDP-A04": {
      "i1": "ATTCCATAAG",
      "i2": "TGCCTGGTGG"
    },
    "UDP-A05": {
      "i1": "GACGAGATTA",
      "i2": "ACATTATCCT"
    },
    "UDP-A06": {
      "i1": "AACATCGCGC",
      "i2": "GTCCACTTGT"
    },
    "UDP-A07": {
      "i1": "CTAGTGCTCT",
      "i2": "TGGAACAGTA"
    },
    "UDP-A08": {
      "i1": "GATCAAGGCA",
      "i2": "CCTTGTTAAT"
    },
    "UDP-A09": {
      "i1": "GACTGAGTAG",
      "i2": "GTTGATAGTG"
    },
    "UDP-A10": {
      "i1": "AGTCAGACGA",
      "i2": "ACCAGCGACA"
    },
    "UDP-A11": {
      "i1": "CCGTATGTTC",
      "i2": "CATACACTGT"
    },
    "UDP-A12": {
      "i1": "GAGTCATAGG",
      "i2": "GTGTGGCGCT"
    },
    "UDP-A13": {
      "i1": "CTTGCCATTA",
      "i2": "ATCACGAAGG"
    },
    "UDP-A15": {
      "i1": "TCCATTGCCG",
      "i2": "GAATGCACGA"
    },
    "UDP-A16": {
      "i1": "CGGTTACGGC",
      "i2": "AAGACTATAG"
    },
    "UDP-A17": {
      "i1": "GAGAATGGTT",
      "i2": "TCGGCAGCAA"
    },
    "UDP-A18": {
      "i1": "AGAGGCAACC",
      "i2": "CTAATGATGG"
    },
    "UDP-A20": {
      "i1": "GATAGGCCGA",
      "i2": "CGCACATGGC"
    },
    "UDP-A21": {
      "i1": "ATGGTTGACT",
      "i2": "GGCCTGTCCT"
    },
    "UDP-A22": {
      "i1": "TATTGCGCTC",
      "i2": "CTGTGTTAGG"
    },
    "UDP-A24": {
      "i1": "TTCTACATAC",
      "i2": "CTAACTGTAA"
    },
    "UDP-A25": {
      "i1": "AACCATAGAA",
      "i2": "GGCGAGATGG"
    },
    "UDP-A26": {
      "i1": "GGTTGCGAGG",
      "i2": "AATAGAGCAA"
    },
    "UDP-A28": {
      "i1": "ACCACGACAT",
      "i2": "TCGTATGCGG"
    },
    "UDP-A29": {
      "i1": "GCCGCACTCT",
      "i2": "TCCGACCTCG"
    },
    "UDP-A30": {
      "i1": "CCACCAGGCA",
      "i2": "CTTATGGAAT"
    },
    "UDP-A31": {
      "i1": "GTGACACGCA",
      "i2": "GCTTACGGAC"
    },
    "UDP-A33": {
      "i1": "TGATTATACG",
      "i2": "GTCGATTACA"
    },
    "UDP-A34": {
      "i1": "CAGCCGCGTA",
      "i2": "ACTAGCCGTG"
    },
    "UDP-A35": {
      "i1": "GGTAACTCGC",
      "i2": "AAGTTGGTGA"
    },
    "UDP-A37": {
      "i1": "TGTAATCGAC",
      "i2": "GATCACCGCG"
    },
    "UDP-A38": {
      "i1": "GTGCAGACAG",
      "i2": "TACCATCCGT"
    },
    "UDP-A39": {
      "i1": "CAATCGGCTG",
      "i2": "GCTGTAGGAA"
    },
    "UDP-A41": {
      "i1": "ACTCGGCAAT",
      "i2": "GACAACTGAA"
    },
    "UDP-A42": {
      "i1": "GTCTAATGGC",
      "i2": "AGTGGTCAGG"
    },
    "UDP-A43": {
      "i1": "CCATCTCGCC",
      "i2": "TTCTATGGTT"
    },
    "UDP-A44": {
      "i1": "CTGCGAGCCA",
      "i2": "AATCCGGCCA"
    },
    "UDP-A45": {
      "i1": "CGTTATTCTA",
      "i2": "CCATAAGGTT"
    },
    "UDP-A46": {
      "i1": "AGATCCATTA",
      "i2": "ATCTCTACCA"
    },
    "UDP-A47": {
      "i1": "GTCCTGGATA",
      "i2": "CGGTGGCGAA"
    },
    "UDP-A48": {
      "i1": "CAGTGGCACT",
      "i2": "TAACAATAGG"
    },
    "UDP-A49": {
      "i1": "AGTGTTGCAC",
      "i2": "CTGGTACACG"
    },
    "UDP-A50": {
      "i1": "GACACCATGT",
      "i2": "TCAACGTGTA"
    },
    "UDP-A51": {
      "i1": "CCTGTCTGTC",
      "i2": "ACTGTTGTGA"
    },
    "UDP-A52": {
      "i1": "TGATGTAAGA",
      "i2": "GTGCGTCCTT"
    },
    "UDP-A53": {
      "i1": "GGAATTGTAA",
      "i2": "AGCACATCCT"
    },
    "UDP-A54": {
      "i1": "GCATAAGCTT",
      "i2": "TTCCGTCGCA"
    },
    "UDP-A55": {
      "i1": "CTGAGGAATA",
      "i2": "CTTAACCACT"
    },
    "UDP-A56": {
      "i1": "AACGCACGAG",
      "i2": "GCCTCGGATA"
    },
    "UDP-A87": {
      "i1": "CCTCTACATG",
      "i2": "GATACCTCCT"
    },
    "UDP-A88": {
      "i1": "GGAGCGTGTA",
      "i2": "ATCCGTAAGT"
    },
    "UDP-A89": {
      "i1": "GTCCGTAAGC",
      "i2": "CGTGTATCTT"
    },
    "UDP-A90": {
      "i1": "ACTTCAAGCG",
      "i2": "GAACCATGAA"
    },
    "UDP-A91": {
      "i1": "TCAGAAGGCG",
      "i2": "GGCCATCATA"
    },
    "UDP-A92": {
      "i1": "GCGTTGGTAT",
      "i2": "ACATACTTCC"
    },
    "UDP-A93": {
      "i1": "ACATATCCAG",
      "i2": "TATGTGCAAT"
    },
    "UDP-A94": {
      "i1": "TCATAGATTG",
      "i2": "GATTAAGGTG"
    },
    "UDP-A95": {
      "i1": "GTATTCCACC",
      "i2": "ATGTAGACAA"
    },
    "UDP-A96": {
      "i1": "CCTCCGTCCA",
      "i2": "CACATCGGTG"
    },
    "UDP-A57": {
      "i1": "TCTATCCTAA",
      "i2": "CGTCGACTGG"
    },
    "UDP-A58": {
      "i1": "CTCGCTTCGG",
      "i2": "TACTAGTCAA"
    },
    "UDP-A59": {
      "i1": "CTGTTGGTCC",
      "i2": "ATAGACCGTT"
    },
    "UDP-A60": {
      "i1": "TTACCTGGAA",
      "i2": "ACAGTTCCAG"
    },
    "UDP-A61": {
      "i1": "TGGCTAATCA",
      "i2": "AGGCATGTAG"
    },
    "UDP-A62": {
      "i1": "AACACTGTTA",
      "i2": "GCAAGTCTCA"
    },
    "UDP-A63": {
      "i1": "ATTGCGCGGT",
      "i2": "TTGGCTCCGC"
    },
    "UDP-A64": {
      "i1": "TGGCGCGAAC",
      "i2": "AACTGATACT"
    },
    "UDP-A65": {
      "i1": "TAATGTGTCT",
      "i2": "GTAAGGCATA"
    },
    "UDP-A66": {
      "i1": "ATACCAACGC",
      "i2": "AATTGCTGCG"
    },
    "UDP-A67": {
      "i1": "AGGATGTGCT",
      "i2": "TTACAATTCC"
    },
    "UDP-A68": {
      "i1": "CACGGAACAA",
      "i2": "AACCTAGCAC"
    },
    "UDP-A69": {
      "i1": "TGGAGTACTT",
      "i2": "TCTGTGTGGA"
    },
    "UDP-A70": {
      "i1": "GTATTGACGT",
      "i2": "GGAATTCCAA"
    },
    "UDP-A71": {
      "i1": "CTTGTACACC",
      "i2": "AAGCGCGCTT"
    },
    "UDP-A72": {
      "i1": "ACACAGGTGG",
      "i2": "TGAGCGTTGT"
    },
    "UDP-A73": {
      "i1": "CCTGCGGAAC",
      "i2": "ATCATAGGCT"
    },
    "UDP-A74": {
      "i1": "TTCATAAGGT",
      "i2": "TGTTAGAAGG"
    },
    "UDP-A75": {
      "i1": "CTCTGCAGCG",
      "i2": "GATGGATGTA"
    },
    "UDP-A76": {
      "i1": "CTGACTCTAC",
      "i2": "ACGGCCGTCA"
    },
    "UDP-A77": {
      "i1": "TCTGGTATCC",
      "i2": "CGTTGCTTAC"
    },
    "UDP-A78": {
      "i1": "CATTAGTGCG",
      "i2": "TGACTACATA"
    },
    "UDP-A79": {
      "i1": "ACGGTCAGGA",
      "i2": "CGGCCTCGTT"
    },
    "UDP-A80": {
      "i1": "GGCAAGCCAG",
      "i2": "CAAGCATCCG"
    },
    "UDP-A81": {
      "i1": "TGTCGCTGGT",
      "i2": "TCGTCTGACT"
    },
    "UDP-A83": {
      "i1": "TATGCCTTAC",
      "i2": "AGACACATTA"
    },
    "UDP-A84": {
      "i1": "ACAAGTGGAC",
      "i2": "GCGCGATGTT"
    },
    "UDP-A85": {
      "i1": "TGGTACCTAA",
      "i2": "CATGAGTACT"
    },
    "UDP-A86": {
      "i1": "TTGGAATTCC",
      "i2": "ACGTCAATAC"
    },
    "UDP-A82": {
      "i1": "ACCGTTACAA",
      "i2": "CTCATAGCGA"
    },
    "UDP-A14": {
      "i1": "GAAGCGGCAC",
      "i2": "CGGCTCTACT"
    },
    "UDP-A19": {
      "i1": "CCATCATTAG",
      "i2": "GGTTGCCTCT"
    },
    "UDP-A23": {
      "i1": "ACGCCTTGTT",
      "i2": "TAAGGAACGT"
    },
    "UDP-A27": {
      "i1": "TAAGCATCCA",
      "i2": "TCAATCCATT"
    },
    "UDP-A32": {
      "i1": "ACAGTGTATG",
      "i2": "GAACATACGG"
    },
    "UDP-A36": {
      "i1": "ACCGGCCGTA",
      "i2": "TGGCAATATT"
    },
    "UDP-A40": {
      "i1": "TATGTAGTCA",
      "i2": "CGCACTAATG"
    },
    "UDP-B83V3": {
      "i1": "CCGACCTGTC",
      "i2": "TGCTCATAAC"
    },
    "UDP-B52V3": {
      "i1": "AAGTGTTAGG",
      "i2": "GCTAGTTCCG"
    },
    "UDP-B51V3": {
      "i1": "TCCACACAGA",
      "i2": "TTGTCGGATG"
    },
    "UDP-B50V3": {
      "i1": "ACAGCGACCA",
      "i2": "CAGGAGCTCT"
    },
    "UDP-B49V3": {
      "i1": "GTGCTAGGTT",
      "i2": "TGAATATTGC"
    },
    "UDP-B06V3": {
      "i1": "CTAGCTTCAA",
      "i2": "TGTGTAAGCT"
    },
    "UDP-B59V3": {
      "i1": "ATGTCGTATT",
      "i2": "TTCTTGCTGG"
    },
    "UDP-B27": {
      "i1": "CGTACAGGAA",
      "i2": "TAGGTTCTCT"
    },
    "UDP-B29": {
      "i1": "AGGCCGTGGA",
      "i2": "CTCGTGCGTT"
    },
    "UDP-B30": {
      "i1": "AGGAGGTATC",
      "i2": "CCAGTTGGCA"
    },
    "UDP-B31": {
      "i1": "GCTGACGTTG",
      "i2": "TGTTCGCATT"
    },
    "UDP-B33": {
      "i1": "TCTAGGCGCG",
      "i2": "CGAAGGTTAA"
    },
    "UDP-B34": {
      "i1": "ATAGCCAAGA",
      "i2": "AGTGCCACTG"
    },
    "UDP-B35": {
      "i1": "TTCGGTGTGA",
      "i2": "GAACAAGTAT"
    },
    "UDP-B36": {
      "i1": "ATGTAACGTT",
      "i2": "ACGATTGCTG"
    },
    "UDP-B38": {
      "i1": "TGGTGTTATG",
      "i2": "TCCAATTCTA"
    },
    "UDP-B39": {
      "i1": "TGGCCTCTGT",
      "i2": "TGAGACAGCG"
    },
    "UDP-B40": {
      "i1": "CCAGGCACCA",
      "i2": "ACGCTAATTA"
    },
    "UDP-B42": {
      "i1": "GGCCAATATT",
      "i2": "CGGTCCGATA"
    },
    "UDP-B43": {
      "i1": "GAATACCTAT",
      "i2": "ACAATAGAGT"
    },
    "UDP-B44": {
      "i1": "TACGTGAAGG",
      "i2": "CGGTTATTAG"
    },
    "UDP-B46": {
      "i1": "ACAACTACTG",
      "i2": "AGTTATCACA"
    },
    "UDP-B47": {
      "i1": "GTTGGATGAA",
      "i2": "TTCCAGGTAA"
    },
    "UDP-B48": {
      "i1": "AATCCAATTG",
      "i2": "CATGTAGAGG"
    },
    "UDP-B49": {
      "i1": "TATGATGGCC",
      "i2": "GATTGTCATA"
    },
    "UDP-B50": {
      "i1": "CGCAGCAATT",
      "i2": "ATTCCGCTAT"
    },
    "UDP-B51": {
      "i1": "ACGTTCCTTA",
      "i2": "GACCGCTGTG"
    },
    "UDP-B52": {
      "i1": "CCGCGTATAG",
      "i2": "TAGGAACCGG"
    },
    "UDP-B56": {
      "i1": "CACAGCGGTC",
      "i2": "ATTCCTATTG"
    },
    "UDP-B57": {
      "i1": "CCACGCTGAA",
      "i2": "TATTCCTCAG"
    },
    "UDP-B58": {
      "i1": "GTTCGGAGTT",
      "i2": "CGCCTTCTGA"
    },
    "UDP-B59": {
      "i1": "ATAGCGGAAT",
      "i2": "GCGCAGAGTA"
    },
    "UDP-B60": {
      "i1": "GCAATATTCA",
      "i2": "GGCGCCAATT"
    },
    "UDP-B61": {
      "i1": "CTAGATTGCG",
      "i2": "AGATATGGCG"
    },
    "UDP-B62": {
      "i1": "CGATGCGGTT",
      "i2": "CCTGCTTGGT"
    },
    "UDP-B63": {
      "i1": "TCCGGACTAG",
      "i2": "GACGAACAAT"
    },
    "UDP-B64": {
      "i1": "GTGACGGAGC",
      "i2": "TGGCGGTCCA"
    },
    "UDP-B65": {
      "i1": "AATTCCATCT",
      "i2": "CTTCAGTTAC"
    },
    "UDP-B66": {
      "i1": "TTAACGGTGT",
      "i2": "TCCTGACCGT"
    },
    "UDP-B67": {
      "i1": "ACTTGTTATC",
      "i2": "CGCGCCTAGA"
    },
    "UDP-B24": {
      "i1": "AGGACAGGCC",
      "i2": "CATTCCAGCT"
    },
    "UDP-B25": {
      "i1": "AGAGAACCTA",
      "i2": "GGTTATGCTA"
    },
    "UDP-B26": {
      "i1": "GATATTGTGT",
      "i2": "ACCACACGGT"
    },
    "UDP-B17": {
      "i1": "GAATTACAAG",
      "i2": "ACCGGCTCAG"
    },
    "UDP-B01": {
      "i1": "TGCCGGTCAG",
      "i2": "CCTGATACAA"
    },
    "UDP-B02": {
      "i1": "CACTCAATTC",
      "i2": "TTAAGTTGTG"
    },
    "UDP-B03": {
      "i1": "TCTCACACGC",
      "i2": "CGGACAGTGA"
    },
    "UDP-B04": {
      "i1": "TCAATGGAGA",
      "i2": "GCACTACAAC"
    },
    "UDP-B05": {
      "i1": "ATATGCATGT",
      "i2": "TGGTGCCTGG"
    },
    "UDP-B06": {
      "i1": "ATGGCGCCTG",
      "i2": "TCCACGGCCT"
    },
    "UDP-B07": {
      "i1": "TCCGTTATGT",
      "i2": "TTGTAGTGTA"
    },
    "UDP-B08": {
      "i1": "GGTCTATTAA",
      "i2": "CCACGACACG"
    },
    "UDP-B09": {
      "i1": "CAGCAATCGT",
      "i2": "TGTGATGTAT"
    },
    "UDP-B10": {
      "i1": "TTCTGTAGAA",
      "i2": "GAGCGCAATA"
    },
    "UDP-B11": {
      "i1": "GAACGCAATA",
      "i2": "ATCTTACTGT"
    },
    "UDP-B12": {
      "i1": "AGTACTCATG",
      "i2": "ATGTCGTGGT"
    },
    "UDP-B13": {
      "i1": "GGTAGAATTA",
      "i2": "GTAGCCATCA"
    },
    "UDP-B14": {
      "i1": "TAATTAGCGT",
      "i2": "TGGTTAAGAA"
    },
    "UDP-B15": {
      "i1": "ATTAACAAGG",
      "i2": "TGTTGTTCGT"
    },
    "UDP-B16": {
      "i1": "TGATGGCTAC",
      "i2": "CCAACAACAT"
    },
    "UDP-B18": {
      "i1": "TAGAATTGGA",
      "i2": "GTTAATCTGA"
    },
    "UDP-B19": {
      "i1": "AGGCAGCTCT",
      "i2": "CGGCTAACGT"
    },
    "UDP-B20": {
      "i1": "ATCGGCGAAG",
      "i2": "TCCAAGAATT"
    },
    "UDP-B22": {
      "i1": "ATACTTGTTC",
      "i2": "TAACCGCCGA"
    },
    "UDP-B23": {
      "i1": "TCCGCCAATT",
      "i2": "CTCCGTGCTG"
    },
    "UDP-B53": {
      "i1": "GATTCTGAAT",
      "i2": "AGCGGTGGAC"
    },
    "UDP-B54": {
      "i1": "TAGAGAATAC",
      "i2": "TATAGATTCG"
    },
    "UDP-B55": {
      "i1": "TTGTATCAGG",
      "i2": "ACAGAGGCCA"
    },
    "UDP-B21": {
      "i1": "CCGTGACCGA",
      "i2": "CCGAACGTTG"
    },
    "UDP-B71": {
      "i1": "AGCCTATGAT",
      "i2": "CACCACCTAC"
    },
    "UDP-B76": {
      "i1": "CCTCCGGTTG",
      "i2": "CATAACACCA"
    },
    "UDP-B80": {
      "i1": "CCTTCTAACA",
      "i2": "GATAAGCTCT"
    },
    "UDP-B84": {
      "i1": "CGCTGTCTCA",
      "i2": "ATTACTCACC"
    },
    "UDP-B89": {
      "i1": "ACGGTCCAAC",
      "i2": "TCTTACATCA"
    },
    "UDP-B93": {
      "i1": "CAACACCGCA",
      "i2": "GGCAGTAGCA"
    },
    "UDP-B28": {
      "i1": "CTGCGTTACC",
      "i2": "TATGGCTCGA"
    },
    "UDP-B32": {
      "i1": "CTAATAACCG",
      "i2": "AACCGCATCG"
    },
    "UDP-B37": {
      "i1": "AACGAGGCCG",
      "i2": "ATACCTGGAT"
    },
    "UDP-B68": {
      "i1": "CGTGTACCAG",
      "i2": "AGGATAAGTT"
    },
    "UDP-B69": {
      "i1": "TTAACCTTCG",
      "i2": "AGGCCAGACA"
    },
    "UDP-B70": {
      "i1": "CATATGCGAT",
      "i2": "CCTTGAACGG"
    },
    "UDP-B72": {
      "i1": "TATGACAATC",
      "i2": "TTGCTTGTAT"
    },
    "UDP-B73": {
      "i1": "ATGTTGTTGG",
      "i2": "CAATCTATGA"
    },
    "UDP-B74": {
      "i1": "GCACCACCAA",
      "i2": "TGGTACTGAT"
    },
    "UDP-B75": {
      "i1": "AGGCGTTCGC",
      "i2": "TTCATCCAAC"
    },
    "UDP-B77": {
      "i1": "GTCCACCGCT",
      "i2": "TCCTATTAGC"
    },
    "UDP-B78": {
      "i1": "ATTGTTCGTC",
      "i2": "TCTCTAGATT"
    },
    "UDP-B79": {
      "i1": "GGACCAGTGG",
      "i2": "CGCGAGCCTA"
    },
    "UDP-B81": {
      "i1": "CTCGAATATA",
      "i2": "GAGATGTCGA"
    },
    "UDP-B82": {
      "i1": "GATCGTCGCG",
      "i2": "CTGGATATGT"
    },
    "UDP-B83": {
      "i1": "TATCCGAGGC",
      "i2": "GGCCAATAAG"
    },
    "UDP-B85": {
      "i1": "AATGCGAACA",
      "i2": "AATTGGCGGA"
    },
    "UDP-B86": {
      "i1": "AATTCTTGGA",
      "i2": "TTGTCAACTT"
    },
    "UDP-B87": {
      "i1": "TTCCTACAGC",
      "i2": "GGCGAATTCT"
    },
    "UDP-B88": {
      "i1": "ATCCAGGTAT",
      "i2": "CAACGTCAGC"
    },
    "UDP-B90": {
      "i1": "GTAACTTGGT",
      "i2": "CGCCATACCT"
    },
    "UDP-B91": {
      "i1": "AGCGCCACAC",
      "i2": "CTAATGTCTT"
    },
    "UDP-B92": {
      "i1": "TGCTACTGCC",
      "i2": "CAACCGGAGG"
    },
    "UDP-B94": {
      "i1": "CACCTTAATC",
      "i2": "TTAGGATAGA"
    },
    "UDP-B95": {
      "i1": "TTGAATGTTG",
      "i2": "CGCAATCTAG"
    },
    "UDP-B96": {
      "i1": "CCGGTAACAC",
      "i2": "GAGTTGTACT"
    },
    "UDP-B41": {
      "i1": "CCGGTTCCTA",
      "i2": "TATATTCGAG"
    },
    "UDP-B45": {
      "i1": "CTTATTGGCC",
      "i2": "GATAACAAGT"
    },
    "UDP-C64V3": {
      "i1": "GTATAGAACA",
      "i2": "TGTCACAGGA"
    },
    "UDP-C30V3": {
      "i1": "TCGATCACGC",
      "i2": "CATAGAGCCT"
    },
    "UDP-C29V3": {
      "i1": "CTAGAGCGCA",
      "i2": "GCTTCTAGCA"
    },
    "UDP-C32V3": {
      "i1": "TTATGGAAGT",
      "i2": "GACAATAACA"
    },
    "UDP-C31V3": {
      "i1": "AACCTGGCTC",
      "i2": "TGAGTATGTT"
    },
    "UDP-C01V3": {
      "i1": "ATCGTTACGG",
      "i2": "GCTCCGGAAG"
    },
    "UDP-C96V3": {
      "i1": "GAGAAGAGGA",
      "i2": "TTGACCTAAC"
    },
    "UDP-C95V3": {
      "i1": "CAAGTCTACA",
      "i2": "CACGTACGTG"
    },
    "UDP-C94V3": {
      "i1": "TATAGGTACT",
      "i2": "TAGGTGAGAT"
    },
    "UDP-C93V3": {
      "i1": "CCTTGGCATC",
      "i2": "GACCGATTCG"
    },
    "UDP-C76V3": {
      "i1": "TCATCTACTA",
      "i2": "TAGGCGACTT"
    },
    "UDP-C75V3": {
      "i1": "GAGGAGCTTC",
      "i2": "GACGTATACA"
    },
    "UDP-C74V3": {
      "i1": "AGTGTCTAGG",
      "i2": "CCTAGAAGCA"
    },
    "UDP-C73V3": {
      "i1": "CTAACCGAGA",
      "i2": "TCGATGCGCG"
    },
    "UDP-C52V3": {
      "i1": "CTCTCGGCTA",
      "i2": "TACCAGATCT"
    },
    "UDP-C02V3": {
      "i1": "TCCTACGTCA",
      "i2": "TACTTAAGTG"
    },
    "UDP-C03V3": {
      "i1": "GTTATATCGC",
      "i2": "AAGACAAGGA"
    },
    "UDP-C04V3": {
      "i1": "GTTGGCCATC",
      "i2": "TGACATTCGT"
    },
    "UDP-C26V3": {
      "i1": "CATCTACGTA",
      "i2": "TGTAATTGAG"
    },
    "UDP-C35V3": {
      "i1": "GCAGCCTCAA",
      "i2": "TAAGTGCTAG"
    },
    "UDP-C28": {
      "i1": "CTAAGTACGC",
      "i2": "AACATACCTA"
    },
    "UDP-C29": {
      "i1": "TAGTTCGGTA",
      "i2": "CCATGTGTAG"
    },
    "UDP-C30": {
      "i1": "CTATTACTAC",
      "i2": "GAGTCTCTCC"
    },
    "UDP-C32": {
      "i1": "ACTCTATTGT",
      "i2": "ATCGCATATG"
    },
    "UDP-C33": {
      "i1": "TAGTGGAAGC",
      "i2": "AGTACCTATA"
    },
    "UDP-C34": {
      "i1": "CGCCATATCT",
      "i2": "GACCGGAGAT"
    },
    "UDP-C36": {
      "i1": "ACTAGCGCTA",
      "i2": "TTACTTCCTC"
    },
    "UDP-C37": {
      "i1": "GCTCTTAACT",
      "i2": "CACGTCCACC"
    },
    "UDP-C38": {
      "i1": "GTGGTATCTG",
      "i2": "GCTACTATCT"
    },
    "UDP-C39": {
      "i1": "TGACGGCCGT",
      "i2": "AGTCAACCAT"
    },
    "UDP-C41": {
      "i1": "TACAAGACTT",
      "i2": "CAGGTGTTCA"
    },
    "UDP-C42": {
      "i1": "CTGTGGTGAC",
      "i2": "GACAGACAGG"
    },
    "UDP-C43": {
      "i1": "CTCCACTAAT",
      "i2": "TGTACTTGTT"
    },
    "UDP-C45": {
      "i1": "ATAGGTCTTA",
      "i2": "GTCACCACAG"
    },
    "UDP-C46": {
      "i1": "TTCTTAACCA",
      "i2": "TCTACATACC"
    },
    "UDP-C47": {
      "i1": "AAGGAAGAGT",
      "i2": "CACGTTAGGC"
    },
    "UDP-C49": {
      "i1": "TGAACGCGGA",
      "i2": "CTTCGAAGGA"
    },
    "UDP-C50": {
      "i1": "CCTGCAACCT",
      "i2": "GTAGAGTCAG"
    },
    "UDP-C51": {
      "i1": "TTCATGGTTC",
      "i2": "GACATTGTCA"
    },
    "UDP-C52": {
      "i1": "ATCCTCTCAA",
      "i2": "TCCGCAAGGC"
    },
    "UDP-C53": {
      "i1": "CACTAGACCA",
      "i2": "ACTGCCTTAT"
    },
    "UDP-C54": {
      "i1": "ATTATCCACT",
      "i2": "TACGCACGTA"
    },
    "UDP-C55": {
      "i1": "ATGGCGTGCC",
      "i2": "CGCTTGAAGT"
    },
    "UDP-C56": {
      "i1": "TCCAGAGATC",
      "i2": "CTGCACTTCA"
    },
    "UDP-C57": {
      "i1": "ATGTCCAGCA",
      "i2": "CAGCGGACAA"
    },
    "UDP-C58": {
      "i1": "CAACGTTCGG",
      "i2": "GGATCCGCAT"
    },
    "UDP-C59": {
      "i1": "GCGTATTAAT",
      "i2": "TGCGGTGTTG"
    },
    "UDP-C60": {
      "i1": "CCGAATCTGG",
      "i2": "ATGAATCAAG"
    },
    "UDP-C61": {
      "i1": "TCTCAATACC",
      "i2": "GACGTTCGCG"
    },
    "UDP-C62": {
      "i1": "AAGCATCTTG",
      "i2": "CATTCAACAA"
    },
    "UDP-C63": {
      "i1": "TCAGTCTCGT",
      "i2": "CACGGATTAT"
    },
    "UDP-C64": {
      "i1": "TGCAAGATAA",
      "i2": "TTGAGGACGG"
    },
    "UDP-C65": {
      "i1": "GTAACAATCT",
      "i2": "CTCTGTATAC"
    },
    "UDP-C66": {
      "i1": "CCATGGTATA",
      "i2": "TCTCGCGGAG"
    },
    "UDP-C67": {
      "i1": "TCATACCGTT",
      "i2": "GGTAACGCAG"
    },
    "UDP-C68": {
      "i1": "GGCGCCATTG",
      "i2": "ACCGCGCAAT"
    },
    "UDP-C69": {
      "i1": "AGCGAATTAG",
      "i2": "AGCCGGAACA"
    },
    "UDP-C70": {
      "i1": "TTAGACCATG",
      "i2": "TCCTAGGAAG"
    },
    "UDP-C71": {
      "i1": "CACACAGTAT",
      "i2": "TTGAGCCTAA"
    },
    "UDP-C72": {
      "i1": "TCTTGTCGGC",
      "i2": "CCACCTGTGT"
    },
    "UDP-C73": {
      "i1": "TACCGCCTCG",
      "i2": "CCTCGCAACC"
    },
    "UDP-C74": {
      "i1": "CTGTTATATC",
      "i2": "GTATAGCTGT"
    },
    "UDP-C76": {
      "i1": "AAGAGAGTCT",
      "i2": "TACGAATCTT"
    },
    "UDP-C77": {
      "i1": "GTAGGCGAGC",
      "i2": "TAGGAGCGCA"
    },
    "UDP-C78": {
      "i1": "AACTTATCCT",
      "i2": "GTACTGGCGT"
    },
    "UDP-C79": {
      "i1": "ATTATGTCTC",
      "i2": "AGTTAAGAGC"
    },
    "UDP-C82": {
      "i1": "GAGGCCTATT",
      "i2": "CTAGTCCGGA"
    },
    "UDP-C83": {
      "i1": "AGCTAAGCGG",
      "i2": "ATTAATACGC"
    },
    "UDP-C84": {
      "i1": "CTTCCTAGGA",
      "i2": "CCTAGAGTAT"
    },
    "UDP-C85": {
      "i1": "CGATCTGTGA",
      "i2": "TAGGAAGACT"
    },
    "UDP-C86": {
      "i1": "GTGGACAAGT",
      "i2": "CCGTGGCCTT"
    },
    "UDP-C87": {
      "i1": "AACAAGTACA",
      "i2": "GGATATATCC"
    },
    "UDP-C88": {
      "i1": "AGATTAAGTG",
      "i2": "CACCTCTTGG"
    },
    "UDP-C90": {
      "i1": "AGAATTCGCC",
      "i2": "CGGCAAGCTC"
    },
    "UDP-C91": {
      "i1": "CCTGACCACT",
      "i2": "TCTTGGCTAT"
    },
    "UDP-C92": {
      "i1": "AGCTGGAATG",
      "i2": "ACGGAATGCG"
    },
    "UDP-C94": {
      "i1": "CATAGTAAGG",
      "i2": "ACCAAGTTAC"
    },
    "UDP-C95": {
      "i1": "ATTGGCTTCT",
      "i2": "TGGCTCGCAG"
    },
    "UDP-C96": {
      "i1": "GTACCGATTA",
      "i2": "AACTAACGTT"
    },
    "UDP-C75": {
      "i1": "TAACCGGCGA",
      "i2": "GCTACATTAG"
    },
    "UDP-C80": {
      "i1": "TATAACAGCT",
      "i2": "TCGCGTATAA"
    },
    "UDP-C31": {
      "i1": "TAGCATAACC",
      "i2": "GCTATGCGCA"
    },
    "UDP-C35": {
      "i1": "GCTTCATATT",
      "i2": "CGTTCAGCCT"
    },
    "UDP-C40": {
      "i1": "CAGTAATTAC",
      "i2": "CGAGGCGGTA"
    },
    "UDP-C44": {
      "i1": "ATAGTTAGCA",
      "i2": "CTCTAAGTAG"
    },
    "UDP-C48": {
      "i1": "GGAAGGAGAC",
      "i2": "TGGTGAGTCT"
    },
    "UDP-C81": {
      "i1": "CCAATGATAC",
      "i2": "GAGTGTGCCG"
    },
    "UDP-C89": {
      "i1": "TATCACTCTG",
      "i2": "AACGTTACAT"
    },
    "UDP-C93": {
      "i1": "TGATAACGAG",
      "i2": "GTTCCGCAGG"
    },
    "UDP-C22": {
      "i1": "TTATACGCGA",
      "i2": "GCCGTCTGTT"
    },
    "UDP-C23": {
      "i1": "CGCTTAGAAT",
      "i2": "CAGAGTGATA"
    },
    "UDP-C24": {
      "i1": "CCGAAGCGCT",
      "i2": "TGCTAACTAT"
    },
    "UDP-C25": {
      "i1": "CACTATCAAC",
      "i2": "TCAGTTAATG"
    },
    "UDP-C26": {
      "i1": "TTGCTCTATT",
      "i2": "GTGACCTTGA"
    },
    "UDP-C27": {
      "i1": "TTACAGTTAG",
      "i2": "ACATGCATAT"
    },
    "UDP-C01": {
      "i1": "TCTCATGATA",
      "i2": "AACACGTGGA"
    },
    "UDP-C02": {
      "i1": "CGAGGCCAAG",
      "i2": "GTGTTACCGG"
    },
    "UDP-C03": {
      "i1": "TTCACGAGAC",
      "i2": "AGATTGTTAC"
    },
    "UDP-C04": {
      "i1": "GCGTGGATGG",
      "i2": "TTGACCAATG"
    },
    "UDP-C05": {
      "i1": "TCCTGGTTGT",
      "i2": "CTGACCGGCA"
    },
    "UDP-C06": {
      "i1": "TAATTCTGCT",
      "i2": "TCTCATCAAT"
    },
    "UDP-C07": {
      "i1": "CGCACGACTG",
      "i2": "GGACCAACAG"
    },
    "UDP-C08": {
      "i1": "GAGGTTAGAC",
      "i2": "AATGTATTGC"
    },
    "UDP-C09": {
      "i1": "AACCGAGTTC",
      "i2": "GATCTCTGGA"
    },
    "UDP-C10": {
      "i1": "TGTGATAACT",
      "i2": "CAGGCGCCAT"
    },
    "UDP-C11": {
      "i1": "AGTATGCTAC",
      "i2": "TTAATAGACC"
    },
    "UDP-C12": {
      "i1": "GTAACTGAAG",
      "i2": "GGAGTCGCGA"
    },
    "UDP-C13": {
      "i1": "TCCTCGGACT",
      "i2": "AACGCCAGAG"
    },
    "UDP-C14": {
      "i1": "CTGGAACTGT",
      "i2": "CGTAATTAAC"
    },
    "UDP-C15": {
      "i1": "GAATATGCGG",
      "i2": "ACGAGACTGA"
    },
    "UDP-C16": {
      "i1": "GATCGGATAA",
      "i2": "GTATCGGCCG"
    },
    "UDP-C17": {
      "i1": "GCTAGACTAT",
      "i2": "AATACGACAT"
    },
    "UDP-C18": {
      "i1": "AGCTACTATA",
      "i2": "GTTATATGGC"
    },
    "UDP-C19": {
      "i1": "CCACCGGAGT",
      "i2": "GCCTGCCATG"
    },
    "UDP-C20": {
      "i1": "CTTACCGCAC",
      "i2": "TAAGACCTAT"
    },
    "UDP-C21": {
      "i1": "TTAGGATATC",
      "i2": "TATACCATGG"
    },
    "UDP-D02V2": {
      "i1": "ATTAGAAGAC",
      "i2": "GCAGGCTGGA"
    },
    "UDP-D13V2": {
      "i1": "TAGTGGCTTG",
      "i2": "AGTTACTTGG"
    },
    "UDP-D83V3": {
      "i1": "ACGAACCATG",
      "i2": "ACTGAATTAC"
    },
    "UDP-D82V3": {
      "i1": "ATCCGGCAGC",
      "i2": "GATCGAATAA"
    },
    "UDP-D81V3": {
      "i1": "GATGAATTCA",
      "i2": "TGCTGTGATT"
    },
    "UDP-D33V3": {
      "i1": "GTAACTCCGC",
      "i2": "AATAGAACGG"
    },
    "UDP-D10V3": {
      "i1": "CCAGGTTATC",
      "i2": "GAATGCAGTT"
    },
    "UDP-D84V3": {
      "i1": "CAACCAAGTA",
      "i2": "CCATCCACGC"
    },
    "UDP-D13v2": {
      "i1": "TAGTGGCTTG",
      "i2": "AGTTACTTGG"
    },
    "UDP-D02v2": {
      "i1": "ATTAGAAGAC",
      "i2": "GCAGGCTGGA"
    },
    "UDP-D02": {
      "i1": "TGTGGTCCGG",
      "i2": "AGAGCACTAG"
    },
    "UDP-D03": {
      "i1": "GCTCGCACAT",
      "i2": "ATGGCTTAAT"
    },
    "UDP-D04": {
      "i1": "AATATTGCCA",
      "i2": "CGGTGACACC"
    },
    "UDP-D06": {
      "i1": "AAGATACACG",
      "i2": "TGTGCTAACA"
    },
    "UDP-D07": {
      "i1": "TGCAATGAAT",
      "i2": "CCAGAAGTAA"
    },
    "UDP-D08": {
      "i1": "CTATGAAGGA",
      "i2": "CTTATACCTG"
    },
    "UDP-D09": {
      "i1": "GAAGACTAGA",
      "i2": "ACTAGAACTT"
    },
    "UDP-D10": {
      "i1": "AGGAGTCGAG",
      "i2": "TTAGGCTTAC"
    },
    "UDP-D11": {
      "i1": "TTCACTCACT",
      "i2": "TATCATGAGA"
    },
    "UDP-D12": {
      "i1": "GGTCCGCTTC",
      "i2": "CTCACACAAG"
    },
    "UDP-D13": {
      "i1": "CAACGAGAGC",
      "i2": "GAATTGAGTG"
    },
    "UDP-D14": {
      "i1": "ATTGAGGTCC",
      "i2": "CGGATTATAT"
    },
    "UDP-D15": {
      "i1": "GGAGAGACTC",
      "i2": "TTGAAGCAGA"
    },
    "UDP-D16": {
      "i1": "CCGCTCCGTT",
      "i2": "TACGGCGAAG"
    },
    "UDP-D17": {
      "i1": "ATACATCACA",
      "i2": "TCTCCATTGA"
    },
    "UDP-D18": {
      "i1": "TAGGTATGTT",
      "i2": "CGAGACCAAG"
    },
    "UDP-D19": {
      "i1": "CACCTAGCAC",
      "i2": "TGCTGGACAT"
    },
    "UDP-D20": {
      "i1": "TTCAAGTATG",
      "i2": "GATGGTATCG"
    },
    "UDP-D21": {
      "i1": "TTAAGACAAG",
      "i2": "GGCTTAATTG"
    },
    "UDP-D22": {
      "i1": "CACCTCTCTT",
      "i2": "CTCGACTCCT"
    },
    "UDP-D23": {
      "i1": "TTCTCGTGCA",
      "i2": "ATACACAGAG"
    },
    "UDP-D24": {
      "i1": "GCTAGGAAGT",
      "i2": "TCTCGGACGA"
    },
    "UDP-D25": {
      "i1": "TTAATAGCAC",
      "i2": "ACCACGTCTG"
    },
    "UDP-D26": {
      "i1": "CATTCACGCT",
      "i2": "GTTGTACTCA"
    },
    "UDP-D27": {
      "i1": "GGCACTAAGG",
      "i2": "TCAGGTCAAC"
    },
    "UDP-D28": {
      "i1": "ATTCGGTACA",
      "i2": "AGTCCGAGGA"
    },
    "UDP-D29": {
      "i1": "ACTAATCTCC",
      "i2": "CACTTAATCT"
    },
    "UDP-D30": {
      "i1": "TGTGTTAGTA",
      "i2": "TACTCTGTTA"
    },
    "UDP-D31": {
      "i1": "CAACGACCTA",
      "i2": "GCGACTCGAT"
    },
    "UDP-D33": {
      "i1": "TCGACGCTAG",
      "i2": "CCTCTTCGAA"
    },
    "UDP-D34": {
      "i1": "CTCGTAGGCA",
      "i2": "TCATCCTCTT"
    },
    "UDP-D35": {
      "i1": "AAGTTCTAGT",
      "i2": "GGTAAGATAA"
    },
    "UDP-D36": {
      "i1": "CCAAGAGGTG",
      "i2": "AACGAGCCAG"
    },
    "UDP-D38": {
      "i1": "TGGATCTGGC",
      "i2": "CAATGCTGAA"
    },
    "UDP-D39": {
      "i1": "TTGAATCCAA",
      "i2": "GTCACGGTGT"
    },
    "UDP-D40": {
      "i1": "CACGGCTAGT",
      "i2": "GGTGTACAAG"
    },
    "UDP-D42": {
      "i1": "AGCTAGCTTC",
      "i2": "TAATACGGAG"
    },
    "UDP-D43": {
      "i1": "CAATCCTTGT",
      "i2": "CGAAGACGCA"
    },
    "UDP-D44": {
      "i1": "CACCTGTTGC",
      "i2": "ATTGACACAT"
    },
    "UDP-D46": {
      "i1": "AATGACTGGT",
      "i2": "TCTCACGCGT"
    },
    "UDP-D47": {
      "i1": "ATGATTCCGG",
      "i2": "CTCTGACGTG"
    },
    "UDP-D48": {
      "i1": "TTAGGCTCAA",
      "i2": "TCGAATGGAA"
    },
    "UDP-D49": {
      "i1": "TGTAAGGTGG",
      "i2": "AAGGCCTTGG"
    },
    "UDP-D50": {
      "i1": "CAACTGCAAC",
      "i2": "TGAACGCAAC"
    },
    "UDP-D51": {
      "i1": "ACATGAGTGA",
      "i2": "CCGCTTAGCT"
    },
    "UDP-D52": {
      "i1": "GCAACCAGTC",
      "i2": "CACCGAGGAA"
    },
    "UDP-D53": {
      "i1": "GAGCGACGAT",
      "i2": "CGTATAATCA"
    },
    "UDP-D54": {
      "i1": "CGAACGCACC",
      "i2": "ATGACAGAAC"
    },
    "UDP-D55": {
      "i1": "TCTTACGCCG",
      "i2": "ATTCATTGCA"
    },
    "UDP-D56": {
      "i1": "AGCTGATGTC",
      "i2": "TCATGTCCTG"
    },
    "UDP-D57": {
      "i1": "CTGAATTAGT",
      "i2": "AATTCGATCG"
    },
    "UDP-D58": {
      "i1": "TAAGGAGGAA",
      "i2": "TTCCGACATT"
    },
    "UDP-D59": {
      "i1": "AGCTTACACA",
      "i2": "TGGCACGACC"
    },
    "UDP-D60": {
      "i1": "AACCAGCCAC",
      "i2": "GCCACAGCAC"
    },
    "UDP-D61": {
      "i1": "CTTAAGTCGA",
      "i2": "CAGTAGTTGT"
    },
    "UDP-D62": {
      "i1": "GCCTAACGTG",
      "i2": "AGCTCTCAAG"
    },
    "UDP-D63": {
      "i1": "ACTTACTTCA",
      "i2": "TCTGGAATTA"
    },
    "UDP-D64": {
      "i1": "CGCATTCCGT",
      "i2": "ATTAGTGGAG"
    },
    "UDP-D65": {
      "i1": "GATATCACAC",
      "i2": "GACTATATGT"
    },
    "UDP-D66": {
      "i1": "AGCGCTGTGT",
      "i2": "CGTTCGGAAC"
    },
    "UDP-D67": {
      "i1": "TCACCGCGCT",
      "i2": "TCGATACTAG"
    },
    "UDP-D68": {
      "i1": "GATAGCCTTG",
      "i2": "TACCACAATG"
    },
    "UDP-D69": {
      "i1": "CCTGGACGCA",
      "i2": "TGGTATACCA"
    },
    "UDP-D70": {
      "i1": "TTACGCACCT",
      "i2": "GCTCTCGTTG"
    },
    "UDP-D71": {
      "i1": "TCGTTGCTGC",
      "i2": "GTCTCGTGAA"
    },
    "UDP-D73": {
      "i1": "GTGTACCTTC",
      "i2": "CTGTGAGCTA"
    },
    "UDP-D74": {
      "i1": "ACCTGGCCAA",
      "i2": "TCACAGATCG"
    },
    "UDP-D75": {
      "i1": "TGTCTGGCCT",
      "i2": "AGAAGCCAAT"
    },
    "UDP-D76": {
      "i1": "AGTTAATGCT",
      "i2": "ACTGCAGCCG"
    },
    "UDP-D77": {
      "i1": "GGTGAGTAAT",
      "i2": "AACATCTAGT"
    },
    "UDP-D78": {
      "i1": "TACTCTGCGC",
      "i2": "CCTTACTATG"
    },
    "UDP-D79": {
      "i1": "AGGTATGGCG",
      "i2": "GTGGCGAGAC"
    },
    "UDP-D80": {
      "i1": "TCCAGCCTGC",
      "i2": "GCCAGATCCA"
    },
    "UDP-D81": {
      "i1": "GCCATATAAC",
      "i2": "ACACAATATC"
    },
    "UDP-D82": {
      "i1": "AGTGCGAGTG",
      "i2": "TGGAGGTAAT"
    },
    "UDP-D83": {
      "i1": "CTGAGCCGGT",
      "i2": "CCTTCACGTA"
    },
    "UDP-D84": {
      "i1": "AACGGTCTAT",
      "i2": "CTATACGCGG"
    },
    "UDP-D85": {
      "i1": "GTTGCGTTCA",
      "i2": "GTTGCAGTTG"
    },
    "UDP-D86": {
      "i1": "CTTCAACCAC",
      "i2": "TTATGCGCCT"
    },
    "UDP-D87": {
      "i1": "TCTATTCAGT",
      "i2": "TCTCAGTACA"
    },
    "UDP-D88": {
      "i1": "CAAGACGTCC",
      "i2": "AGTATACGGA"
    },
    "UDP-D89": {
      "i1": "TGAGTACAAC",
      "i2": "ACGCTTGGAC"
    },
    "UDP-D90": {
      "i1": "CCGCGGTTCT",
      "i2": "GGAGTAGATT"
    },
    "UDP-D91": {
      "i1": "ATTGATACTG",
      "i2": "TACACGCTCC"
    },
    "UDP-D92": {
      "i1": "GGATTATGGA",
      "i2": "TCCGATAGAG"
    },
    "UDP-D93": {
      "i1": "TGGTTCTCAT",
      "i2": "CTCAAGGCCG"
    },
    "UDP-D94": {
      "i1": "TCAACCACGA",
      "i2": "CAAGTTCATA"
    },
    "UDP-D95": {
      "i1": "TATGAACTTG",
      "i2": "AATCCTTAGG"
    },
    "UDP-D96": {
      "i1": "AGTGGTTAAG",
      "i2": "GGTGGAATAC"
    },
    "UDP-D32": {
      "i1": "CGGTCGGCAT",
      "i2": "CTAGGCAAGG"
    },
    "UDP-D37": {
      "i1": "ATATCTGCTT",
      "i2": "TAGACAATCT"
    },
    "UDP-D41": {
      "i1": "GAGCTTGCCG",
      "i2": "AGGTTGCAGG"
    },
    "UDP-D45": {
      "i1": "CGTCACCTTG",
      "i2": "CAGCCGATTG"
    },
    "UDP-D01": {
      "i1": "AGATAGTAGC",
      "i2": "GGCACGCCAT"
    },
    "UDP-D05": {
      "i1": "TCGTGCATTC",
      "i2": "GCGTTGGTAT"
    },
    "UDP-D72": {
      "i1": "CGACAAGGAT",
      "i2": "AAGGCCACCT"
    }
  };

  function initUI() {
    // console.log("DRAGEN Script: initUI started");
    setInterval(() => {
      const targetBtn = document.getElementById('btnSearch');
      const myBtn = document.getElementById('btn-dragen-launcher');

      // 타겟 버튼은 있는데 내 버튼이 없으면 생성
      if (targetBtn && !myBtn) {
        // console.log("DRAGEN Script: Target button found, injecting launcher...");
        createLauncherButton(targetBtn);
      }
    }, 1000);
  }

  function createLauncherButton(targetBtn) {
    if (document.getElementById('btn-dragen-launcher')) return;

    const btn = document.createElement('button');
    btn.id = 'btn-dragen-launcher';
    btn.innerText = 'DRAGEN CSV 생성';
    btn.type = 'button';

    btn.className = targetBtn.className;

    const computedStyle = window.getComputedStyle(targetBtn);
    // 버튼을 Search 버튼 왼쪽에 배치하므로, 기존 Search 버튼의 왼쪽 여백을 가져옴
    btn.style.marginLeft = computedStyle.marginLeft || '10px';
    // Search 버튼과의 간격 조정
    btn.style.marginRight = '10px';

    btn.style.backgroundColor = '#28a745';
    btn.style.borderColor = '#218838';
    btn.style.color = '#fff';

    btn.style.width = 'auto';
    btn.style.paddingLeft = '15px';
    btn.style.paddingRight = '15px';
    btn.style.minWidth = '140px';

    const rect = targetBtn.getBoundingClientRect();
    if (rect.height > 0) {
      btn.style.height = rect.height + 'px';
      btn.style.lineHeight = 'normal';
    }

    btn.onclick = openModal;
    // Search 버튼 '앞(왼쪽)'에 삽입
    targetBtn.parentNode.insertBefore(btn, targetBtn);
  }

  function openModal() {
    let modal = document.getElementById('samplesheet-modal');
    if (!modal) {
      createModal();
      modal = document.getElementById('samplesheet-modal');
    }
    modal.style.display = 'block';
  }

  function createModal() {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'samplesheet-modal';
    modalContainer.style.cssText = `
            position: fixed; top: 100px; right: 100px;
            width: 400px; background-color: white;
            border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            font-family: 'Malgun Gothic', sans-serif;
            z-index: 10000; border: 1px solid #ddd;
            display: none;
        `;

    const header = document.createElement('div');
    header.style.cssText = `
            padding: 10px 15px; background-color: #f1f1f1;
            border-bottom: 1px solid #ddd; border-radius: 8px 8px 0 0;
            cursor: move; display: flex; justify-content: space-between; align-items: center;
        `;

    const title = document.createElement('strong');
    title.innerText = '🧪 DRAGEN SampleSheet 생성기';
    title.style.color = '#333';

    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = 'cursor: pointer; font-size: 20px; color: #666; font-weight: bold;';
    closeBtn.onclick = () => { modalContainer.style.display = 'none'; };

    header.appendChild(title);
    header.appendChild(closeBtn);
    modalContainer.appendChild(header);

    const content = document.createElement('div');
    content.style.padding = '20px';

    content.innerHTML = `
            <div style="margin-bottom: 15px;">
                <label style="display:block; font-size:12px; margin-bottom:5px; font-weight:600; color:#555;">Run Name:</label>
                <input type="text" id="popRunName" placeholder="예: 1125-6B_KDNA" 
                    style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
            </div>
            <div style="margin-bottom: 15px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <label style="font-size:12px; font-weight:600; color:#555;">JOB NO 목록:</label>
                </div>
                <textarea id="popJobNo" placeholder="작업 번호를 붙여넣으세요..." 
                    style="width:100%; height:120px; padding:8px; border:1px solid #ccc; border-radius:4px; resize:vertical; box-sizing:border-box;"></textarea>
            </div>
            <button id="btn-pop-download" 
                style="width:100%; padding: 10px; background-color:#28a745; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">
                📥 CSV 생성
            </button>
            <div id="pop-status" style="margin-top:10px; font-size:12px; color:#666; min-height:18px;"></div>
        `;

    modalContainer.appendChild(content);
    document.body.appendChild(modalContainer);

    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    header.addEventListener("mousedown", dragStart);
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("mousemove", drag);

    function dragStart(e) {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      if (e.target === header || e.target === title) {
        isDragging = true;
      }
    }

    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        setTranslate(currentX, currentY, modalContainer);
      }
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

    document.getElementById('btn-pop-download').onclick = processAndDownload;
  }

  function processAndDownload() {
    const statusEl = document.getElementById('pop-status');
    const runName = document.getElementById('popRunName').value.trim();
    const jobNoText = document.getElementById('popJobNo').value.trim();

    statusEl.innerText = '처리 중...';

    if (!runName) {
      statusEl.innerText = '⚠️ Run Name을 입력해주세요.';
      statusEl.style.color = 'red';
      return;
    }
    if (!jobNoText) {
      statusEl.innerText = '⚠️ JOB NO를 입력해주세요.';
      statusEl.style.color = 'red';
      return;
    }
    if (typeof ibsAmplification === 'undefined') {
      statusEl.innerText = '❌ 페이지 로딩 대기 중... (그리드 없음)';
      return;
    }

    const targetJobNos = jobNoText.split(/[\n\s]+/)
      .filter(item => item.trim() !== '')
      .map(item => item.trim().toUpperCase());

    const targetSet = new Set(targetJobNos);
    const extractedData = [];
    let missingIndices = [];

    const firstRow = ibsAmplification.GetDataFirstRow();
    const lastRow = ibsAmplification.GetDataLastRow();

    for (let i = firstRow; i <= lastRow; i++) {
      const rowJobNo = String(ibsAmplification.GetCellValue(i, "ampId")).trim().toUpperCase();

      if (targetSet.has(rowJobNo)) {
        const laneText = ibsAmplification.GetCellText(i, "lanInfo");
        const laneMatch = laneText.match(/\d+/);
        const lane = laneMatch ? laneMatch[0] : laneText;

        const sampleId = ibsAmplification.GetCellValue(i, "libNm");
        const idxCode = ibsAmplification.GetCellValue(i, "idxCd");

        let idx1 = "", idx2 = "";
        if (INDEX_MAP[idxCode]) {
          idx1 = INDEX_MAP[idxCode].i1;
          idx2 = INDEX_MAP[idxCode].i2;
        } else {
          missingIndices.push(idxCode);
        }

        extractedData.push({
          lane: lane,
          sampleId: sampleId,
          idxCode: idxCode,
          idx1: idx1,
          idx2: idx2,
          originalOrder: i // 원래 순서 보존 (필요시)
        });
      }
    }

    // ===============================================
    // 정렬 로직 (최종 수정: MinLane Priority Group Sort)
    // ===============================================

    // 1. Sample_ID 별로 그룹핑
    const groupedMap = new Map();
    extractedData.forEach(item => {
      if (!groupedMap.has(item.sampleId)) {
        groupedMap.set(item.sampleId, []);
      }
      groupedMap.get(item.sampleId).push(item);
    });

    // 2. 각 그룹을 "최소 Lane 번호" 기준으로 정렬하기 위한 배열 생성
    const groupList = [];
    groupedMap.forEach((items, sampleId) => {
      // 해당 그룹의 최소 Lane 번호 찾기
      const minLane = Math.min(...items.map(item => parseInt(item.lane) || 999));
      // 해당 그룹의 원래 등장 순서(첫번째 아이템 기준) 찾기 (Lane 같을 때 보조 정렬용)
      const minOrder = Math.min(...items.map(item => item.originalOrder));

      groupList.push({
        sampleId: sampleId,
        items: items,
        minLane: minLane,
        minOrder: minOrder
      });
    });

    // 3. 그룹 정렬 (1순위: minLane 오름차순, 2순위: 원래 등장 순서)
    groupList.sort((a, b) => {
      if (a.minLane !== b.minLane) {
        return a.minLane - b.minLane;
      }
      return a.minOrder - b.minOrder;
    });

    // 4. 최종 데이터 조합 및 그룹 내 Lane 정렬
    const sortedData = [];
    groupList.forEach(group => {
      // 그룹 내에서는 Lane 번호 오름차순 정렬
      group.items.sort((a, b) => parseInt(a.lane) - parseInt(b.lane));
      sortedData.push(...group.items);
    });

    // 정렬 결과 반영
    extractedData.splice(0, extractedData.length, ...sortedData);


    if (extractedData.length === 0) {
      statusEl.innerText = '❌ 일치하는 데이터를 찾지 못했습니다.';
      statusEl.style.color = 'red';
      return;
    }

    if (missingIndices.length > 0) {
      const uniqueMissing = Array.from(new Set(missingIndices));
      alert(`⚠️ 경고: 매핑되지 않은 Index Code가 있습니다: ${uniqueMissing.join(', ')}`);
    }

    try {
      const csvContent = generateCSV(runName, extractedData);
      downloadCSV(csvContent, `SampleSheet_${runName}.csv`);
      statusEl.innerText = `✅ 완료! (${extractedData.length}건)`;
      statusEl.style.color = 'green';
    } catch (e) {
      console.error(e);
      statusEl.innerText = '❌ 오류 발생';
    }
  }

  function generateCSV(runName, data) {
    const LB = '\n';
    let csv = "";

    csv += `[Header],,,,${LB}`;
    csv += `FileFormatVersion,2,,,${LB}`;
    csv += `RunName,${runName},,,${LB}`;
    csv += `InstrumentPlatform,NovaSeqXSeries,,,${LB}`;
    csv += `IndexOrientation,Forward,,,${LB}`;
    csv += `AnalysisLocation,Local,,,${LB}`;
    csv += `,,,,${LB}`;

    csv += `[Reads],,,,${LB}`;
    csv += `Read1Cycles,151,,,${LB}`;
    csv += `Read2Cycles,151,,,${LB}`;
    csv += `Index1Cycles,10,,,${LB}`;
    csv += `Index2Cycles,10,,,${LB}`;
    csv += `,,,,${LB}`;

    csv += `[BCLConvert_Settings],,,,${LB}`;
    csv += `SoftwareVersion,4.3.16,,,${LB}`;
    csv += `OverrideCycles,Y151;I10;I10;Y151,,,${LB}`;
    csv += `FastqCompressionFormat,gzip,,,${LB}`;
    csv += `GenerateFastqcMetrics,FALSE,,,${LB}`;
    csv += `,,,,${LB}`;

    csv += `[BCLConvert_Data],,,,${LB}`;
    csv += `Lane,Sample_ID,Index,Index2,${LB}`;
    data.forEach(row => {
      csv += `${row.lane},${row.sampleId},${row.idx1},${row.idx2},${LB}`;
    });
    csv += `,,,,${LB}`;

    csv += `[Cloud_Settings],,,,${LB}`;
    csv += `GeneratedVersion,1.21.0.202509100010,,,${LB}`;
    csv += `,,,,${LB}`;

    csv += `[Cloud_Data],,,,${LB}`;
    csv += `Sample_ID,ProjectName,LibraryName,LibraryPrepKitName,IndexAdapterKitName${LB}`;

    const processedSamples = new Set();
    data.forEach(row => {
      if (!processedSamples.has(row.sampleId)) {
        processedSamples.add(row.sampleId);
        let libName = `${row.sampleId}_${row.idx1}`;
        if (row.idx2) libName += `_${row.idx2}`;
        csv += `${row.sampleId},,${libName},,${LB}`;
      }
    });

    return csv;
  }

  function downloadCSV(content, fileName) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  initUI();
})();
