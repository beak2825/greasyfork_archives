// ==UserScript==
// @name         WebSocket Communication Basic Data Decoder
// @namespace    https://greasyfork.org/en/users/1462379-3lectr0n-nj
// @version      1.0
// @description  In terms of Uint8Array
// @author       3lectr0N!nj@
// @icon         https://cdn.discordapp.com/avatars/1240124778728132693/02be852a2bd883c3e15fd41177bf7a3f.webp
// @grant        none
// ==/UserScript==

let DD = {
    Read:{
        array:null,
        ReadBytes(size){
       return [DD.Read.array.slice(0,size),size]
    },
        ReadByte(){
        return this.ReadBytes(1)[0]
    },
        In_built:{
        ReadFloat16(littleEndian){
        return new DataView(new Uint8Array(DD.Read.ReadBytes(2)[0]).buffer).getFloat16(0,littleEndian)
    },
        ReadFloat32(littleEndian){
        return new DataView(new Uint8Array(DD.Read.ReadBytes(4)[0]).buffer).getFloat32(0,littleEndian)
    },
        ReadFloat64(littleEndian){
        return new DataView(new Uint8Array(DD.Read.ReadBytes(8)[0]).buffer).getFloat64(0,littleEndian)
    },
        ReadUint16(littleEndian){
        return new DataView(new Uint8Array(DD.Read.ReadBytes(2)[0]).buffer).getUint16(0,littleEndian)
    },
        ReadUint32(littleEndian){
        return new DataView(new Uint8Array(DD.Read.ReadBytes(4)[0]).buffer).getUint32(0,littleEndian)
    },
        ReadBigUint64Array(littleEndian){
            return new DataView(new Uint8Array(DD.Read.ReadBytes(8)[0]).buffer).getBigUint64(0,littleEndian)
        },
        ReadInt16(littleEndian){
        return new DataView(new Uint8Array(DD.Read.ReadBytes(2)[0]).buffer).getInt16(0,littleEndian)
    },
        ReadInt32(littleEndian){
        return new DataView(new Uint8Array(DD.Read.ReadBytes(4)[0]).buffer).getInt32(0,littleEndian)
    },
        ReadBigInt64Array(littleEndian){
            return new DataView(new Uint8Array(DD.Read.ReadBytes(8)[0]).buffer).getBigInt64(0,littleEndian)
        },
        ReadHex() {
            return Array.from(DD.Read.array).map(byte => byte.toString(16).padStart(2, '0')).join('');
},
        ReadString(){
            let s = new TextDecoder().decode(DD.Read.array)
            return s
    },
        },
        Protobuf:{
            zigZagDecode32(n) {
                return (n >>> 1) ^ -(n & 1);
},
            zigZagDecode64(n) {
                return (n >> 1n) ^ (-(n & 1n))
},
            ReadUint32_Varint() {
            let result = 0;
            let shift = 0;
            let length = 0

    for (let i = 0; i < 5; i++) {
        const byte = DD.Read.array[i];
        length++;
        const value = byte & 127;
        result |= value << shift;

        if ((byte & 128) === 0) {
            return [result >>> 0, length ];
        }

        shift += 7;}
},
            ReadUint64_Varint(){
    let result = 0n;
    let shift = 0n;
    let length = 0;
    for (let i = 0; i < 10; i++) {
        const byte = BigInt(DD.Read.array[i]);
        length++;
        const value = byte & 127n;
        result |= value << shift;

        if ((byte & 128n) === 0n) {
            return [ result, length ];
        }

        shift += 7n;
    }},
            ReadInt32_Varint() {
                const [v,l] = this.ReadUint32_Varint()
                return [v | 0,l]
            },
            ReadInt64_Varint(){
                let [v,l] = this.ReadUint64_Varint()
                const maxInt64 = 1n << 63n;
                let signed = v;
                if (v & maxInt64) {
                    signed = -((~v & (maxInt64 - 1n)) + 1n);
                }
                return [signed, l];
            },
            ReadSint32_Varint() {
                let uint = this.ReadUint32_Varint()
                let int = this.zigZagDecode32(uint[0])
                return [int,uint[1]]
            },
            ReadSint64_Varint(){
                let uint = this.ReadUint64_Varint()
                let int = this.zigZagDecode64(uint[0])
                return [int,uint[1]]
            },
            ReadFixed32(){
                return DD.Read.In_built.ReadUint32(1)
            },
            ReadSfixed32(){
                return DD.Read.In_built.ReadInt32(1)
            },
            ReadFixed64(){
                return DD.Read.In_built.ReadBigUint64Array(1)
            },
            ReadSfixed64(){
                return DD.Read.In_built.ReadBigInt64Array(1)
            },
            ReadFloat(){
                return DD.Read.In_built.ReadFloat32(1)
            },
            ReadDouble(){
                return DD.Read.In_built.ReadFloat64(1)
            },
            ReadUTF_8_String(){
                return DD.Read.ReadString()
            },
            ReadBoolean(){
                let b = DD.Read.ReadByte()
                if(b==1){return true}
                else{return false}
            }
        },
        Photon:{
            Protocol_16:{
                ReadBoolean(){
                    return DD.Read.ReadByte()>0
                },
                ReadShort(){
                    return DD.Read.In_built.ReadInt16()
                },
                ReadLong(){
                    return DD.Read.In_built.ReadBigInt64Array()
                },
                ReadInteger(){
                    return DD.Read.In_built.ReadInt32()
                },
                ReadFloat(){
                    return DD.Read.In_built.ReadFloat32()
                },
                ReadDouble(){
                    return DD.Read.In_built.ReadFloat64()
                },
                ReadString(){
                    return DD.Read.In_built.ReadString()
                },
            },
            Protocol_18:{
                Read_Int1(bool){
                    return DD.Read.ReadByte()*((-1)**(!!bool))
                },
                Read_Int2(bool){
                    return (DD.Read.In_built.ReadInt16())*((-1)**(!!bool))
                },
                ReadBoolean(){
                    return DD.Read.ReadByte()>0
                },
                ReadShort(){
                    return DD.Read.In_built.ReadInt16()
                },
                ReadInteger(){
                    return DD.Read.In_built.ReadInt32()
                },
                ReadFloat(){
                    return DD.Read.In_built.ReadFloat32()
                },
                ReadDouble(){
                    return DD.Read.In_built.ReadFloat64()
                },
                ReadString(){
                    return DD.Read.In_built.ReadString()
                },
                ReadCompressedInt(){
                    return DD.Read.Protobuf.ReadSint32_Varint()
                },
                ReadCompressedLong(){
                return DD.Read.Protobuf.ReadSint64_Varint()
                },
                ReadInt1(){
                return this.Read_Int1(false)
                },
                ReadInt1_(){
                return this.Read_Int1(true)
                },
                ReadInt2(){
                return this.Read_Int2(false)
                },
                ReadInt2_(){
                return this.Read_Int2(true)
                },
                ReadL1(){
                return this.Read_Int1(false)
                },
                ReadL1_(){
                return this.Read_Int1(true)
                },
                ReadL2(){
                return this.Read_Int2(false)
                },
                ReadL2_(){
                return this.Read_Int2(true)
                },
            },
        },
    },
    Write:{
        In_built:{
        WriteFloat16(value,littleEndian){
            const buffer = new ArrayBuffer(2);
            const view = new DataView(buffer);
            view.setFloat16(0, value, littleEndian);
            return new Uint8Array(view.buffer)
        },
        WriteFloat32(value,littleEndian){
            const buffer = new ArrayBuffer(4);
            const view = new DataView(buffer);
            view.setFloat32(0, value, littleEndian);
            return new Uint8Array(view.buffer)
        },
        WriteFloat64(value,littleEndian){
            const buffer = new ArrayBuffer(8);
            const view = new DataView(buffer);
            view.setFloat64(0, value, littleEndian);
            return new Uint8Array(view.buffer)
        },
        WriteUint16(value,littleEndian){
            const buffer = new ArrayBuffer(2);
            const view = new DataView(buffer);
            view.setUint16(0, value, littleEndian);
            return new Uint8Array(view.buffer)
        },
        WriteUint32(value,littleEndian){
            const buffer = new ArrayBuffer(4);
            const view = new DataView(buffer);
            view.setUint32(0, value, littleEndian);
            return new Uint8Array(view.buffer)
        },
        WriteBigUint64Array(value,littleEndian){
            const buffer = new ArrayBuffer(8);
            const view = new DataView(buffer);
            view.setBigUint64(0, value, littleEndian);
            return new Uint8Array(view.buffer)
        },
        WriteInt16(value,littleEndian){
            const buffer = new ArrayBuffer(2);
            const view = new DataView(buffer);
            view.setInt16(0, value, littleEndian);
            return new Uint8Array(view.buffer)
        },
        WriteInt32(value,littleEndian){
            const buffer = new ArrayBuffer(4);
            const view = new DataView(buffer);
            view.setInt32(0, value, littleEndian);
            return new Uint8Array(view.buffer)
        },
        WriteBigInt64Array(value,littleEndian){
            const buffer = new ArrayBuffer(8);
            const view = new DataView(buffer);
            view.setBigInt64(0, value, littleEndian);
            return new Uint8Array(view.buffer)
        },
        WriteHex(hex){
  if (hex.startsWith('0x')) {
    hex = hex.slice(2);
  }
  if (hex.length % 2 !== 0) {
    throw new Error("Hex string must have an even length");
  }
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    array[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return array;
    },
        WriteString(string,encoding){
            let a = new TextEncoder(encoding).encode(string)
            return a
        },
        },
        Protobuf:{
            zigZagEncode32(n) {
                return (n << 1) ^ (n >> 31);
            },
            zigZagEncode64(n) {
                return (n << 1n) ^ (n >> 63n);
            },
            WriteUint32_Varint(value) {
  const bytes = [];
  while (value > 127) {
    bytes.push((value & 0x7F) | 0x80);
    value >>>= 7;
  }
  bytes.push(value);
  return new Uint8Array(bytes);
},
            WriteUint64_Varint(value) {
    value = BigInt(value);

    if (value < 0n || value > 0xFFFFFFFFFFFFFFFFn) {
        throw new Error("Out of bounds");
    }

    const bytes = [];

    while (value >= 0x80n) {
        bytes.push(Number((value & 0x7Fn) | 0x80n));
        value >>= 7n;
    }

    bytes.push(Number(value));
    return new Uint8Array(bytes);
},
            WriteInt32_Varint(value){
                return this.WriteUint32_Varint(value >>> 0)
            },
            WriteInt64_Varint(value){
                return this.WriteUint64_Varint(BigInt(value))
            },
            WriteSint32_Varint(value){
                return this.WriteUint32_Varint(this.zigZagEncode32(value))
            },
            WriteSint64_Varint(value){
                return this.WriteUint64_Varint(this.zigZagEncode64(BigInt(value)))
            },
            WriteFixed32(value){
                return DD.Write.In_built.WriteUint32(value,1)
            },
            WriteSfixed32(value){
                return DD.Write.In_built.WriteInt32(value,1)
            },
            WriteFixed64(value){
                return DD.Write.In_built.WriteBigUint64Array(value,1)
            },
            WriteSfixed64(value){
                return DD.Write.In_built.WriteBigInt64Array(value,1)
            },
            WriteFloat(value){
                return DD.Write.In_built.WriteFloat32(value,1)
            },
            WriteDouble(value){
                return DD.Write.In_built.WriteFloat64(value,1)
            },
            WriteString(value){
                return DD.Write.In_built.WriteString(value)
            },
            WriteBool(value){
                switch(value){
                    case true:
                        return 1
                        break;
                    case false:
                        return 0
                        break;
                }
            }
        },
        Photon:{
            Protocol_16:{
                WriteBoolean(value){
                    return DD.Write.Protobuf.WriteBool(value)
                },
                WriteShort(value){
                    DD.Write.In_built.WriteInt16(value)
                },
                WriteLong(value){
                    return DD.Write.In_built.WriteBigInt64Array(value)
                },
                WriteInteger(value){
                    return DD.Write.In_built.WriteInt32(value)
                },
                WriteFloat(value){
                    return DD.Write.In_built.WriteFloat32(value)
                },
                WriteDouble(value){
                    return DD.Write.In_built.WriteFloat64(value)
                },
                WriteString(value){
                    return DD.Write.In_built.WriteString(value)
                },
            },
            Protocol_18:{
                WriteInt_1(value,bool){
                    return value*((-1)**(!bool))
                },
                WriteInt_2(value,bool){
                    return DD.Write.In_built.WriteInt16(value*((-1)**(!bool)))
                },
                WriteBoolean(value){
                    return DD.Write.Protobuf.WriteBool(value)
                },
                WriteShort(value){
                    DD.Write.In_built.WriteInt16(value)
                },
                WriteInteger(value){
                    return DD.Write.In_built.WriteInt32(value)
                },
                WriteFloat(value){
                    return DD.Write.In_built.WriteFloat32(value)
                },
                WriteDouble(value){
                    return DD.Write.In_built.WriteFloat64(value)
                },
                WriteString(value){
                    return DD.Write.In_built.WriteString(value)
                },
                WriteCompressedInt(value){
                    return DD.Write.Protobuf.WriteSint32_Varint(value)
                },
                WriteCompressedLong(value){
                    return DD.Write.Protobuf.WriteSint64_Varint(value)
                },
                WriteInt1(value){
                    return this.WriteInt_1(value,false)
                },
                WriteInt1_(value){
                    return this.WriteInt_1(value,true)
                },
                WriteInt2(value){
                    return this.WriteInt_1(value,false)
                },
                WriteInt2_(value){
                    return this.WriteInt_1(value,true)
                },
                WriteL1(value){
                    return this.WriteInt_1(value,false)
                },
                WriteL1_(value){
                    return this.WriteInt_1(value,true)
                },
                WriteL2(value){
                    return this.WriteInt_1(value,false)
                },
                WriteL2_(value){
                    return this.WriteInt_1(value,true)
                },
            },
        },
    }
}
window.DD = DD