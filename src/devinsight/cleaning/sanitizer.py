import json
import re
from typing import List, Optional
from devinsight.schemas.github import GitHubDependency


class DataSanitizer:
    """Sanitizes raw GitHub string fields and parses dependency manifests."""

    @staticmethod
    def sanitize_text(text: Optional[str], max_length: Optional[int] = None) -> Optional[str]:
        """Clean string by removing control chars, trimming whitespace, and truncating if needed."""
        if not text:
            return None

        # Remove control characters except newline and tab
        cleaned = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", text)
        cleaned = cleaned.strip()

        if not cleaned:
            return None

        if max_length and len(cleaned) > max_length:
            return cleaned[:max_length]

        return cleaned

    @staticmethod
    def sanitize_topics(topics: List[str]) -> List[str]:
        """Deduplicate and normalize topic tags."""
        seen = set()
        sanitized = []
        for topic in topics:
            if not topic:
                continue
            clean = topic.strip().lower()
            if clean and clean not in seen:
                seen.add(clean)
                sanitized.append(clean)
        return sanitized

    @staticmethod
    def parse_python_requirements(
        content: str, repo_full_name: str, file_source: str = "requirements.txt"
    ) -> List[GitHubDependency]:
        """Extract Python package dependencies from requirements.txt content."""
        deps = []
        if not content:
            return deps

        for line in content.splitlines():
            line = line.strip()

            # Ignore comments and flags (-r, -e, --extra-index-url)
            if not line or line.startswith("#") or line.startswith("-"):
                continue

            # Split inline comments
            line = line.split("#")[0].strip()
            if not line:
                continue

            # Regex for package name and optional version specifier
            match = re.match(
                r"^([a-zA-Z0-9_\-\.]+)\s*([~=><!^]=?.*)?$",
                line,
            )
            if match:
                package_name = match.group(1).strip()
                version_spec = match.group(2).strip() if match.group(2) else None

                # Ignore specifiers that look like local file paths
                if "/" in package_name or "\\" in package_name:
                    continue

                deps.append(
                    GitHubDependency(
                        package_name=package_name.lower(),
                        version_spec=version_spec,
                        ecosystem="python",
                        file_source=file_source,
                        repo_full_name=repo_full_name,
                    )
                )

        return deps

    @staticmethod
    def parse_package_json(
        content: str, repo_full_name: str, file_source: str = "package.json"
    ) -> List[GitHubDependency]:
        """Extract Node.js package dependencies from package.json content."""
        deps = []
        if not content:
            return deps

        try:
            data = json.loads(content)
            dep_sections = ["dependencies", "devDependencies", "peerDependencies"]

            for section in dep_sections:
                if section in data and isinstance(data[section], dict):
                    for pkg, ver in data[section].items():
                        if isinstance(ver, str):
                            deps.append(
                                GitHubDependency(
                                    package_name=pkg.lower(),
                                    version_spec=ver,
                                    ecosystem="npm",
                                    file_source=f"{file_source} ({section})",
                                    repo_full_name=repo_full_name,
                                )
                            )
        except (json.JSONDecodeError, Exception):
            pass

        return deps

    @staticmethod
    def parse_go_mod(
        content: str, repo_full_name: str, file_source: str = "go.mod"
    ) -> List[GitHubDependency]:
        """Extract Go module dependencies from go.mod content."""
        deps = []
        if not content:
            return deps

        in_require_block = False
        for line in content.splitlines():
            line = line.strip()
            if not line or line.startswith("//"):
                continue

            if line == "require (":
                in_require_block = True
                continue
            elif line == ")" and in_require_block:
                in_require_block = False
                continue

            if in_require_block:
                parts = line.split()
                if len(parts) >= 2:
                    deps.append(
                        GitHubDependency(
                            package_name=parts[0],
                            version_spec=parts[1],
                            ecosystem="go",
                            file_source=file_source,
                            repo_full_name=repo_full_name,
                        )
                    )
            elif line.startswith("require "):
                parts = line[8:].strip().split()
                if len(parts) >= 2:
                    deps.append(
                        GitHubDependency(
                            package_name=parts[0],
                            version_spec=parts[1],
                            ecosystem="go",
                            file_source=file_source,
                            repo_full_name=repo_full_name,
                        )
                    )

        return deps
