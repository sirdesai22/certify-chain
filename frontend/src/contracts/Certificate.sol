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
        string hash;
        uint256 issuedAt;
        bool revoked;
    }

    mapping(uint256 => CertificateData) public certificates;
    uint256 public certificateCount;

    event CertificateIssued(uint256 indexed id, address student, address institution);
    event CertificateRevoked(uint256 indexed id);

    constructor(address _registryAddress) {
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

        emit CertificateIssued(certificateCount, _student, msg.sender);
    }

    function revokeCertificate(uint256 _id) external onlyInstitution {
        CertificateData storage cert = certificates[_id];
        require(cert.institution == msg.sender, "Not issuer");
        cert.revoked = true;
        emit CertificateRevoked(_id);
    }

    function verifyCertificate(uint256 _id, string memory _hash) external view returns (bool) {
        CertificateData memory cert = certificates[_id];
        if (cert.revoked) return false;
        return (keccak256(abi.encodePacked(cert.hash)) == keccak256(abi.encodePacked(_hash)));
    }
}
