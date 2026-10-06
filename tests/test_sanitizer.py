from devinsight.cleaning.sanitizer import DataSanitizer


def test_sanitize_text():
    assert DataSanitizer.sanitize_text(None) is None
    assert DataSanitizer.sanitize_text("   Hello World!   ") == "Hello World!"
    assert DataSanitizer.sanitize_text("Text\x00with\x07control chars") == "Textwithcontrol chars"
    assert DataSanitizer.sanitize_text("Long text content", max_length=4) == "Long"


def test_sanitize_topics():
    topics = ["Python", "python", "  REACT ", "", None, "machine-learning"]
    cleaned = DataSanitizer.sanitize_topics(topics)
    assert cleaned == ["python", "react", "machine-learning"]


def test_parse_python_requirements():
    content = """
    # Requirements file
    httpx>=0.27.0
    pydantic==2.7.0 # Core schema
    scikit-learn
    -r sub_requirements.txt
    """
    deps = DataSanitizer.parse_python_requirements(content, "user/repo")
    assert len(deps) == 3
    package_names = [d.package_name for d in deps]
    assert "httpx" in package_names
    assert "pydantic" in package_names
    assert "scikit-learn" in package_names
    assert deps[0].ecosystem == "python"


def test_parse_package_json():
    content = """{
        "name": "sample-app",
        "dependencies": {
            "react": "^18.2.0",
            "axios": "^1.6.0"
        },
        "devDependencies": {
            "typescript": "^5.0.0"
        }
    }"""
    deps = DataSanitizer.parse_package_json(content, "user/js-repo")
    assert len(deps) == 3
    package_names = [d.package_name for d in deps]
    assert "react" in package_names
    assert "axios" in package_names
    assert "typescript" in package_names
    assert deps[0].ecosystem == "npm"


def test_parse_go_mod():
    content = """
    module github.com/user/gorepo

    go 1.22

    require (
        github.com/gin-gonic/gin v1.9.1
        github.com/stretchr/testify v1.8.4
    )
    """
    deps = DataSanitizer.parse_go_mod(content, "user/gorepo")
    assert len(deps) == 2
    assert deps[0].package_name == "github.com/gin-gonic/gin"
    assert deps[0].ecosystem == "go"
