// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CertifyRegistry.sol";

contract Certificate {
    CertifyRegistry public registry;

    struct CertificateData {
        uint256 id;
        address student;
        address institution;
        string ipfsCid;
        string hash; // store as hex string
        uint256 issuedAt;
        bool revoked;
    }

    mapping(uint256 => CertificateData) public certificates;
    mapping(address => uint256[]) public certificatesByStudent;
    uint256 public certificateCount;

    event CertificateIssued(uint256 indexed id, address indexed student, address indexed institution);
    event CertificateRevoked(uint256 indexed id);

    constructor(address _registryAddress) {
        require(_registryAddress != address(0), "Registry zero");
        registry = CertifyRegistry(_registryAddress);
    }

    modifier onlyInstitution() {
        require(registry.isInstitution(msg.sender), "Not a registered institution");
        _;
    }

    function issueCertificate(address _student, string memory _ipfsCid, string memory _hash)
        external
        onlyInstitution
    {
        require(_student != address(0), "Invalid student");
        require(bytes(_ipfsCid).length > 0, "Empty CID");
        require(bytes(_hash).length > 0, "Empty hash");

        certificateCount++;
        certificates[certificateCount] = CertificateData({
            id: certificateCount,
            student: _student,
            institution: msg.sender,
            ipfsCid: _ipfsCid,
            hash: _hash,
            issuedAt: block.timestamp,
            revoked: false
        });

        certificatesByStudent[_student].push(certificateCount);

        emit CertificateIssued(certificateCount, _student, msg.sender);
    }

    function revokeCertificate(uint256 _id) external {
        CertificateData storage cert = certificates[_id];
        require(cert.id != 0, "Certificate not exist");
        require(cert.institution == msg.sender, "Only issuer can revoke");
        cert.revoked = true;
        emit CertificateRevoked(_id);
    }

    function getCertificate(uint256 _id) external view returns (CertificateData memory) {
        return certificates[_id];
    }

    function getCertificatesByStudent(address _student) external view returns (uint256[] memory) {
        return certificatesByStudent[_student];
    }

    function verifyCertificateHash(uint256 _id, string memory _hash) external view returns (bool) {
        CertificateData memory cert = certificates[_id];
        if (cert.id == 0) return false;
        if (cert.revoked) return false;
        return (keccak256(abi.encodePacked(cert.hash)) == keccak256(abi.encodePacked(_hash)));
    }
}
